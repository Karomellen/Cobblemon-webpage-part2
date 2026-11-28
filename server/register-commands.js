import 'dotenv/config'
import { REST, Routes, SlashCommandBuilder } from 'discord.js'

const { DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } = process.env
if (!DISCORD_BOT_TOKEN || !DISCORD_CLIENT_ID || !DISCORD_GUILD_ID) {
  throw new Error('Set DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID, and DISCORD_GUILD_ID first.')
}

const command = new SlashCommandBuilder()
  .setName('archive')
  .setDescription('Add an image to the newspaper archive')
  .addStringOption((option) =>
    option.setName('subtext').setDescription('Short description').setRequired(true),
  )
  .addAttachmentOption((option) =>
    option.setName('image').setDescription('PNG, JPEG, or WebP image up to 8 MiB').setRequired(true),
  )

const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN)
await rest.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID), {
  body: [command.toJSON()],
})
console.info('Registered /archive in the configured server.')
