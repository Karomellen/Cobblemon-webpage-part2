import { Link, NavLink, Outlet } from 'react-router-dom'
import StatusBar from './StatusBar.jsx'
import { SERVER_NAME, SERVER_PART, STATUS_ENABLED } from '../config.js'

const NAV = [
  { to: '/home', label: 'Home' },
  { to: '/announcements', label: 'Announcements' },
  { to: '/archive', label: 'Archive' },
  { to: '/rules', label: 'Rules' },
  { to: '/support', label: 'Support' },
]

export default function Layout() {
  return (
    <>
      {STATUS_ENABLED && <StatusBar />}

      <div className="scene">
        <header className="header">
          <Link to="/home" className="brand pixel">
            <img src="/images/oshawott.png" alt="" />
            <span>
              {SERVER_NAME} <em>{SERVER_PART}</em>
            </span>
          </Link>
          <nav className="nav" aria-label="Main">
            {NAV.map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `chip pixel${isActive ? ' active' : ''}`}>
                {label}
              </NavLink>
            ))}
          </nav>
        </header>
        <img className="mascot" src="/images/oshawott.png" alt="" />
      </div>

      <main className="container">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-body">
          <p>Fan-made server. Not an official Minecraft, Pokémon or Cobblemon product.</p>
          <Link to="/">
            Replay intro
          </Link>
        </div>
      </footer>
    </>
  )
}
