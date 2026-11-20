import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router-dom'
import Panel from '../components/Panel.jsx'
import ProfileCards from '../components/ProfileCards.jsx'
import { SERVER_NAME, SERVER_PART } from '../config.js'
import { spriteSrc } from '../sprites.js'

// Part 1 key moments, shown as a timeline. `label` appears big in the background.
const MOMENTS = [
  { label: 'ACT 1', text: '[KEY MOMENT 1]' },
  { label: 'ACT 2', text: '[KEY MOMENT 2]' },
  { label: 'ACT 3', text: '[KEY MOMENT 3]' },
]
const SEGMENTS = 24

const EXPLORE = [
  { to: '/announcements', title: 'Announcements', text: 'Events and modpack changelogs, most important first.', sprite: 'pikachu' },
  { to: '/archive', title: 'Archive', text: 'Expired hub newspapers, newest first.', sprite: 'furret' },
  { to: '/rules', title: 'Rules', text: 'What to follow, sorted by priority.', sprite: 'rowlet' },
  { to: '/support', title: 'Support', text: 'Discord contacts and common questions.', sprite: 'mudkip' },
]

function Recap() {
  const [step, setStep] = useState(0)
  const filled = Math.round(((step + 1) / MOMENTS.length) * SEGMENTS)
  const go = (d) => setStep((s) => (s + d + MOMENTS.length) % MOMENTS.length)

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="ghost"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.25 }}
        >
          {MOMENTS[step].label}
        </motion.div>
      </AnimatePresence>

      <h2>Part 1 recap</h2>
      <p>[2-3 sentences recapping Minecraft SMP part 1 and what carries over into part 2.]</p>
      <div className="recap-body">
        <button className="round-btn" onClick={() => go(-1)} aria-label="Previous moment">◀</button>
        <motion.p key={step} className="quote" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          {MOMENTS[step].text}
        </motion.p>
        <button className="round-btn" onClick={() => go(1)} aria-label="Next moment">▶</button>
      </div>

      <div className="progress" aria-hidden="true">
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <span key={i} className={i < filled ? 'on' : ''} />
        ))}
      </div>
      <div className="steps">
        {MOMENTS.map((m, i) => (
          <button key={m.label} className={i === step ? 'active' : ''} onClick={() => setStep(i)} aria-pressed={i === step}>
            {m.label}
          </button>
        ))}
      </div>
    </>
  )
}

export default function Landing() {
  return (
    <>
      <Panel sprite="mudkip" count={3} className="hero">
        <div className="hero-screen">
          <h1 className="mega">
            <span>{SERVER_NAME}</span>
            <span>{SERVER_PART}</span>
          </h1>
          <motion.img
            className="hero-pika"
            src="/images/sprites/pikachu.png"
            alt=""
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.img
            className="hero-rowlet"
            src="/images/sprites/rowlet.png"
            alt=""
            animate={{ rotate: [-6, 6, -6] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <p className="lead">[SHORT SERVER INTRO: what the server is, who it is for, what is new in part 2.]</p>
        <div className="row">
          <Link to="/rules" className="btn primary">Read the rules</Link>
          <Link to="/announcements" className="btn">Announcements</Link>
        </div>
      </Panel>

      <Panel tone="yellow" sprite="furret" count={3} className="recap">
        <Recap />
      </Panel>

      <Panel sprite="rowlet" className="explore-panel">
        <h2 className="title-lg">Explore</h2>
        <div className="inset grid">
          {EXPLORE.map((e) => (
            <motion.div key={e.to} whileHover={{ y: -6 }} whileTap={{ scale: 0.97 }}>
              <Link to={e.to} className="card explore">
                <img src={spriteSrc(e.sprite)} alt="" />
                <h3>{e.title}</h3>
                <p>{e.text}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </Panel>

      <Panel sprite="oshawott" count={2} className="team">
        <div className="team-head">
          <p className="kicker">Behind every server, there are people</p>
          <h2 className="title-lg">Need help?</h2>
        </div>
        <ProfileCards />
      </Panel>
    </>
  )
}
