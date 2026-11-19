import { Link } from 'react-router-dom'
import ProfileCards from '../components/ProfileCards.jsx'
import { SERVER_NAME, SERVER_PART } from '../config.js'

const EXPLORE = [
  { to: '/announcements', title: 'Announcements', text: 'Events and modpack changelogs, most important first.' },
  { to: '/archive', title: 'Archive', text: 'Expired hub newspapers, newest first.' },
  { to: '/rules', title: 'Rules', text: 'What to follow, sorted by priority.' },
  { to: '/support', title: 'Support', text: 'Discord contacts and common questions.' },
]

export default function Landing() {
  return (
    <>
      <section className="card pixel hero">
        <h1>
          {SERVER_NAME} <em>{SERVER_PART}</em>
        </h1>
        <p>[SHORT SERVER INTRO: what the server is, who it is for, what is new in part 2.]</p>
        <div className="row">
          <Link to="/rules" className="btn pixel primary">Read the rules</Link>
          <Link to="/announcements" className="btn pixel">Announcements</Link>
        </div>
      </section>

      <section className="card pixel">
        <h2>Part 1 recap</h2>
        <p>[2-3 sentences recapping Minecraft SMP part 1 and what carries over into part 2.]</p>
        <ul>
          <li>[KEY MOMENT 1]</li>
          <li>[KEY MOMENT 2]</li>
          <li>[KEY MOMENT 3]</li>
        </ul>
      </section>

      <section>
        <h2 className="section-title">Explore</h2>
        <div className="grid">
          {EXPLORE.map((e) => (
            <Link key={e.to} to={e.to} className="card pixel explore">
              <h3>{e.title}</h3>
              <p>{e.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">Need help?</h2>
        <ProfileCards />
      </section>
    </>
  )
}
