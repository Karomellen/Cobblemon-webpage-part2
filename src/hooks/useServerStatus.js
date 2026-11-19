import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_BASE ?? ''

// Returns { state: 'loading' | 'online' | 'offline' | 'unknown', players }
// 'unknown' means the API itself could not be reached.
export function useServerStatus(intervalMs = 60_000) {
  const [status, setStatus] = useState({ state: 'loading' })

  useEffect(() => {
    let alive = true

    async function load() {
      try {
        const res = await fetch(`${API}/api/status`)
        if (!res.ok) throw new Error('bad response')
        const data = await res.json()
        if (alive) setStatus({ state: data.online ? 'online' : 'offline', players: data.players })
      } catch {
        if (alive) setStatus({ state: 'unknown' })
      }
    }

    load()
    const id = setInterval(load, intervalMs)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [intervalMs])

  return status
}
