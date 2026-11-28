import { randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import {
  Client,
  EmbedBuilder,
  Events,
  GatewayIntentBits,
  Partials,
} from 'discord.js'
import { formatArchiveDate, getImageFormat, isAllowedImageSize } from './archive-utils.js'

const BUCKET = 'archive-images'
const ALLOWED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp'])

function createStore() {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured')
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  })
}

export function registerArchiveRoute(app) {
  app.get('/api/archive', async (_req, res) => {
    try {
      const { data, error } = await createStore()
        .from('archive_issues')
        .select('id, username, date, subtext, image_url, uploader_discord_id, uploader_username')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
      if (error) throw error
      res.json(data)
    } catch (error) {
      console.error('Could not load archive:', error.message)
      res.status(503).json({ error: 'Archive is unavailable' })
    }
  })
}

async function removeArchivePost(store, messageId) {
  const { data, error } = await store
    .from('archive_issues')
    .select('storage_path')
    .eq('discord_message_id', messageId)
    .maybeSingle()
  if (error) throw error
  if (!data) return

  const { error: deleteError } = await store
    .from('archive_issues')
    .delete()
    .eq('discord_message_id', messageId)
  if (deleteError) throw deleteError

  const { error: storageError } = await store.storage.from(BUCKET).remove([data.storage_path])
  if (storageError) throw storageError
}

async function fetchImage(attachment) {
  if (!ALLOWED_IMAGE_TYPES.has(attachment.contentType)) {
    throw new Error('Use a PNG, JPEG, or WebP image.')
  }
  if (!isAllowedImageSize(attachment.size)) {
    throw new Error('The image must be 8 MiB or smaller.')
  }

  const response = await fetch(attachment.url, { signal: AbortSignal.timeout(15_000) })
  if (!response.ok) throw new Error(`Discord image download failed (${response.status}).`)

  const bytes = Buffer.from(await response.arrayBuffer())
  if (!isAllowedImageSize(bytes.length)) throw new Error('The image must be 8 MiB or smaller.')

  const format = getImageFormat(bytes)
  if (!format || format.contentType !== attachment.contentType) {
    throw new Error('The attachment must be a valid PNG, JPEG, or WebP image.')
  }
  return { bytes, format }
}

export async function startArchiveBot() {
  const token = process.env.DISCORD_BOT_TOKEN
  if (!token) {
    console.info('Discord archive bot disabled: DISCORD_BOT_TOKEN is not set')
    return
  }

  const {
    DISCORD_GUILD_ID,
    ARCHIVE_CHANNEL_ID,
    ARCHIVE_ROLE_ID,
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
  } = process.env
  const missing = Object.entries({
    DISCORD_GUILD_ID,
    ARCHIVE_CHANNEL_ID,
    ARCHIVE_ROLE_ID,
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
  })
    .filter(([, value]) => !value)
    .map(([name]) => name)
  if (missing.length) throw new Error(`Missing archive bot settings: ${missing.join(', ')}`)

  const store = createStore()
  const bot = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    partials: [Partials.Channel, Partials.Message],
  })

  bot.once(Events.ClientReady, (client) => {
    console.info(`Archive bot ready as ${client.user.tag}`)
  })

  bot.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand() || interaction.commandName !== 'archive') return

    await interaction.deferReply({ ephemeral: true })
    try {
      if (interaction.guildId !== DISCORD_GUILD_ID) {
        throw new Error('This command is not enabled in this server.')
      }
      if (interaction.channelId !== ARCHIVE_CHANNEL_ID) {
        throw new Error('Use this command in the archive channel.')
      }

      const member = await interaction.guild.members.fetch(interaction.user.id)
      if (!member.roles.cache.has(ARCHIVE_ROLE_ID)) {
        throw new Error('You need the Cobblemon role to upload archive entries.')
      }

      const username = member.displayName
      const date = interaction.createdAt.toISOString().slice(0, 10)
      const subtext = interaction.options.getString('subtext', true).trim()
      const attachment = interaction.options.getAttachment('image', true)
      if (!username || username.length > 50) throw new Error('Username must be 1-50 characters.')
      if (!subtext || subtext.length > 500) throw new Error('Subtext must be 1–500 characters.')

      const { bytes, format } = await fetchImage(attachment)
      const id = randomUUID()
      const storagePath = `${id}.${format.extension}`
      const { error: uploadError } = await store.storage
        .from(BUCKET)
        .upload(storagePath, bytes, { contentType: format.contentType, upsert: false })
      if (uploadError) throw uploadError

      let post
      try {
        const imageUrl = store.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl
        post = await interaction.channel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle(username)
              .setDescription(subtext)
              .setImage(imageUrl)
              .setFooter({ text: formatArchiveDate(date) }),
          ],
        })

        const { error: insertError } = await store.from('archive_issues').insert({
          id,
          username,
          date,
          subtext,
          image_url: imageUrl,
          uploader_discord_id: interaction.user.id,
          uploader_username: member.displayName,
          storage_path: storagePath,
          discord_message_id: post.id,
        })
        if (insertError) throw insertError
      } catch (error) {
        if (post) await post.delete().catch((cleanupError) => console.error('Could not remove failed archive post:', cleanupError.message))
        const { error: cleanupError } = await store.storage.from(BUCKET).remove([storagePath])
        if (cleanupError) console.error('Could not remove failed archive image:', cleanupError.message)
        throw error
      }

      await interaction.editReply('Archive entry uploaded.')
    } catch (error) {
      console.error('Archive upload failed:', error.message)
      await interaction.editReply(error.message || 'Archive upload failed. Please try again.')
    }
  })

  bot.on(Events.MessageDelete, async (message) => {
    if (message.channelId !== ARCHIVE_CHANNEL_ID) return
    try {
      await removeArchivePost(store, message.id)
    } catch (error) {
      console.error(`Could not remove deleted archive post ${message.id}:`, error.message)
    }
  })

  bot.on(Events.MessageBulkDelete, (messages) => {
    for (const message of messages.values()) {
      if (message.channelId !== ARCHIVE_CHANNEL_ID) continue
      removeArchivePost(store, message.id).catch((error) => {
        console.error(`Could not remove deleted archive post ${message.id}:`, error.message)
      })
    }
  })

  await bot.login(token)
}
