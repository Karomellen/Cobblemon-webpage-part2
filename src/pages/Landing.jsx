import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router-dom'
import Panel from '../components/Panel.jsx'
import ProfileCards from '../components/ProfileCards.jsx'
import { SERVER_NAME, SERVER_PART } from '../config.js'
import { spriteSrc } from '../sprites.js'
import { CHRISTMAS_CALENDAR } from '../data/christmasCalendar.js'

const ORDINAL_SUFFIXES = ['th', 'st', 'nd', 'rd']

function getOrdinal(day) {
  const suffix = day % 100 >= 11 && day % 100 <= 13
    ? 'th'
    : ORDINAL_SUFFIXES[day % 10] || ORDINAL_SUFFIXES[0]
  return `${day}${suffix} December`
}

const EXPLORE = [
  { to: '/announcements', title: 'Announcements', text: 'Events and modpack changelogs, most important first.', sprite: 'pikachu' },
  { to: '/archive', title: 'Archive', text: 'Expired hub newspapers, newest first.', sprite: 'furret' },
  { to: '/rules', title: 'Rules', text: 'What to follow, sorted by priority.', sprite: 'rowlet' },
  { to: '/support', title: 'Support', text: 'Discord contacts and common questions.', sprite: 'mudkip' },
]

function Recap() {
  const slides = CHRISTMAS_CALENDAR
  const [step, setStep] = useState(0)
  const availableSlides = slides.length
  const selectedDay = slides[step].day
  const filled = step + 1
  const go = (difference) => setStep((current) => Math.max(0, Math.min(current + difference, availableSlides - 1)))

  const labelDays = [...new Set([
    1,
    selectedDay,
  ].filter((day) => day > 0))]

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
          {selectedDay}
        </motion.div>
      </AnimatePresence>

      <h2>Christmas Calendar</h2>
      <p>One new celebration appears each day in December.</p>
      <div className="recap-body">
        <button
          className="round-btn"
          onClick={() => go(-1)}
          aria-label="Previous day"
          disabled={step === 0}
        >{'\u25C0'}</button>
        <motion.p key={step} className="quote" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <>
            <strong>{getOrdinal(selectedDay)}</strong>
            <br />
            In honor of {slides[step].person}. {slides[step].text}
            <span className="calendar-pokemon">
              <img
                src={slides[step].sprite}
                alt={slides[step].pokemon}
                className="calendar-sprite"
                width="64"
                height="64"
              />
              <span>{slides[step].pokemon}</span>
            </span>
          </>
        </motion.p>
        <button
          className="round-btn"
          onClick={() => go(1)}
          aria-label="Next day"
          disabled={step >= availableSlides - 1}
        >{'\u25B6'}</button>
      </div>

      <div className="progress" aria-hidden="true">
        {Array.from({ length: availableSlides }, (_, i) => (
          <span key={i} className={i < filled ? 'on' : ''} />
        ))}
      </div>
      <div className="steps">
        {labelDays.map((day) => (
          <button
            key={day}
            className={day === selectedDay ? 'active' : ''}
            onClick={() => setStep(day - 1)}
            aria-pressed={day === selectedDay}
          >
            {`${day} Dec`}
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
            src="/sprites/pikachu.png"
            alt=""
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.img
            className="hero-rowlet"
            src="/sprites/rowlet.png"
            alt=""
            animate={{ rotate: [-6, 6, -6] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <div className="lead">
          <h2>Welcome to the Christmas Cobblemon Server! 🎄</h2>
          <p>Before Hardcore SMP Season 2, we're slowing down for a cozy December. Snow covers the world and Pokémon roam the frosty land.</p>
          <p>Together we're building a Christmas village. Open a bakery, run a Pokémon daycare or set up a cocoa shop, with hundreds of furniture pieces, lights and festive blocks to make your home your own.</p>
          <p>Every village needs residents. Catch Pokémon, trade with friends and fill the village with life.</p>
        </div>
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
