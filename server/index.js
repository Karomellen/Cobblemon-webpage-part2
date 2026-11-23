import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { registerArchiveRoute, startArchiveBot } from './archive.js'

const {
  PORT = 3001,
  MC_HOST,
  MC_PORT = '25565',
  STATUS_API_KEY,
  CLIENT_ORIGIN = 'http://localhost:5173',
} = process.env

const CACHE_MS = 30_000
let cache = { at: 0, data: null }

async function fetchStatus() {
  const url = `https://api.mcstatus.io/v2/status/java/${MC_HOST}:${MC_PORT}`
  const headers = STATUS_API_KEY ? { Authorization: `Bearer ${STATUS_API_KEY}` } : {}
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`Status provider answered ${res.status}`)

  const json = await res.json()
  return {
    online: Boolean(json.online),
    players: json.online ? { online: json.players?.online ?? 0, max: json.players?.max ?? 0 } : null,
  }
}

const app = express()
const allowedOrigins = CLIENT_ORIGIN.split(',').map((origin) => origin.trim())
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
      callback(new Error(`Origin not allowed: ${origin}`))
    },
  }),
)

registerArchiveRoute(app)

app.get('/api/status', async (_req, res) => {
  if (!MC_HOST) return res.status(500).json({ error: 'MC_HOST is not set' })

  if (cache.data && Date.now() - cache.at < CACHE_MS) return res.json(cache.data)

  try {
    cache = { at: Date.now(), data: await fetchStatus() }
    res.json(cache.data)
  } catch (err) {
    console.error(err.message)
    res.status(502).json({ error: 'Status unavailable' })
  }
})

await startArchiveBot()
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`))
