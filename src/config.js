export const SERVER_NAME = 'COBBLEMON'
export const SERVER_PART = 'PART 2'

// Set to true once the status API (npm run server) is running.
// While false, the status bar is hidden and /api/status is never called.
export const STATUS_ENABLED = false

// Typed out on the book in the intro. YES appears when both lines are done.
export const INTRO = {
  line1: 'Are you ready?',
  line2: 'Part 2 begins.',
}

// Leave url empty to show the handle as plain text instead of a button.
// sprite: name of a file in /images/sprites/ shown on the card.
export const PROFILES = [
  { handle: '@Bambooskies', role: '[ROLE]', url: '', sprite: 'raichu' },
  { handle: '@Karomell', role: '[ROLE]', url: '', sprite: 'sprigatito' },
]
