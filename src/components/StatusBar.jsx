import { useServerStatus } from '../hooks/useServerStatus.js'

function describe({ state, players }) {
  switch (state) {
    case 'online':
      return players ? `Server online: ${players.online} / ${players.max} players` : 'Server online'
    case 'offline':
      return 'Server offline'
    case 'unknown':
      return 'Server status unavailable'
    default:
      return 'Checking server...'
  }
}

export default function StatusBar() {
  const status = useServerStatus()

  return (
    <div className="status-bar" role="status">
      <span className={`status-dot ${status.state}`} aria-hidden="true" />
      {describe(status)}
    </div>
  )
}
