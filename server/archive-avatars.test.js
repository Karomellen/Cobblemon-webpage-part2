import test from 'node:test'
import assert from 'node:assert/strict'
import { CHRISTMAS_CALENDAR } from '../src/data/christmasCalendar.js'
import { resolveCalendarAvatars } from './archive.js'

test('resolves calendar avatar URLs keyed by day', async () => {
  const fetchedIds = []
  const avatars = await resolveCalendarAvatars({
    users: {
      fetch: async (discordId) => {
        fetchedIds.push(discordId)
        return {
          displayAvatarURL: ({ size }) => `https://avatar.test/${discordId}?size=${size}`,
        }
      },
    },
  })

  assert.equal(fetchedIds.length, CHRISTMAS_CALENDAR.length)
  assert.equal(avatars[1], `https://avatar.test/${CHRISTMAS_CALENDAR[0].discordId}?size=128`)
  assert.equal(avatars[22], `https://avatar.test/${CHRISTMAS_CALENDAR[21].discordId}?size=128`)
})
