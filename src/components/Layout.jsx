import { MotionConfig } from 'motion/react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import Hearts from './Hearts.jsx'
import StatusBar from './StatusBar.jsx'
import { SERVER_NAME, SERVER_PART, STATUS_ENABLED } from '../config.js'

const NAV = [
  { to: '/home', label: 'Home' },
  { to: '/announcements', label: 'Announcements' },
  { to: '/archive', label: 'Archive' },
  { to: '/rules', label: 'Rules' },
  { to: '/support', label: 'Support' },
  { to: '/install', label: 'Install' },
]

export default function Layout() {
  return (

    <MotionConfig reducedMotion="user">
      <div className="site">
        {STATUS_ENABLED && <StatusBar />}

        {}
        <header className="hud">
          <Link to="/home" className="hud-brand">
            <Hearts />
            <span>{SERVER_NAME}</span>
          </Link>
          <nav className="hud-nav" aria-label="Main">
            {NAV.map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `hud-link${isActive ? ' active' : ''}`}>
                {label}
              </NavLink>
            ))}
          </nav>
          <span className="hud-part">{SERVER_PART}</span>
        </header>

        <main className="stage">
          <Outlet />
        </main>

        <footer className="footer">
          <p>Fan-made server. Not an official Minecraft, Pokémon or Cobblemon product.</p> 
          <Link to="https://pokemondb.net/sprites" className="btn">Pokémon sprites</Link>
          <Link to="/" className="btn">Replay intro</Link>
        </footer>
      </div>
    </MotionConfig>
  )
}
