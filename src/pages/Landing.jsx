import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router-dom'
import Panel from '../components/Panel.jsx'
import ProfileCards from '../components/ProfileCards.jsx'
import { SERVER_NAME, SERVER_PART } from '../config.js'
import { spriteSrc } from '../sprites.js'
import { CHRISTMAS_CALENDAR } from '../data/christmasCalendar.js'

const API = import.meta.env.VITE_API_BASE ?? ''
const ORDINAL_SUFFIXES = ['th', 'st', 'nd', 'rd']

function getOrdinal(day) {
  const suffix = day % 100 >= 11 && day % 100 <= 13
    ? 'th'
    : ORDINAL_SUFFIXES[day % 10] || ORDINAL_SUFFIXES[0]
  return `${day}${suffix} December`
}

function isCalendarDayAvailable(day, today) {
  return today >= new Date(today.getFullYear(), 11, day)
}

const EXPLORE = [
  { to: '/announcements', title: 'Announcements', text: 'Events and modpack changelogs, most important first.', sprite: 'pikachu' },
  { to: '/archive', title: 'Archive', text: 'Expired hub newspapers, newest first.', sprite: 'furret' },
  { to: '/rules', title: 'Rules', text: 'What to follow, sorted by priority.', sprite: 'rowlet' },
  { to: '/support', title: 'Support', text: 'Discord contacts and common questions.', sprite: 'mudkip' },
]

const OPENED_DAY_STORAGE_PREFIX = 'cobblemon-calendar-opened-day-'

function Recap() {
  const slides = CHRISTMAS_CALENDAR
  const [step, setStep] = useState(0)
  const [today, setToday] = useState(() => new Date())
  const [discordAvatars, setDiscordAvatars] = useState({})
  const [openedDays, setOpenedDays] = useState(() => new Set(
    CHRISTMAS_CALENDAR
      .filter(({ day }) => window.localStorage.getItem(`${OPENED_DAY_STORAGE_PREFIX}${day}`) === 'true')
      .map(({ day }) => day),
  ))
  useEffect(() => {
    const controller = new AbortController()

    fetch(`${API}/api/calendar/avatars`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Calendar avatars are unavailable.')
        return response.json()
      })
      .then((data) => {
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
          throw new Error('Calendar avatar response is invalid.')
        }
        setDiscordAvatars(data)
      })
      .catch((error) => {
        if (error.name !== 'AbortError') console.error('Could not load calendar avatars:', error.message)
      })

    return () => controller.abort()
  }, [])
  useEffect(() => {
    const now = new Date()
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    const timeout = window.setTimeout(() => setToday(new Date()), nextMidnight.getTime() - now.getTime())
    return () => window.clearTimeout(timeout)
  }, [today])
  const availableSlides = slides.length
  const selectedDay = slides[step].day
  const discordAvatar = slides[step].discordAvatar || discordAvatars[selectedDay]
  const canOpen = isCalendarDayAvailable(selectedDay, today)
  const isOpened = import.meta.env.DEV || (canOpen && openedDays.has(selectedDay))
  const filled = step + 1
  const go = (difference) => setStep((current) => Math.max(0, Math.min(current + difference, availableSlides - 1)))
  const openSelectedDay = () => {
    if (!canOpen || isOpened) return
    window.localStorage.setItem(`${OPENED_DAY_STORAGE_PREFIX}${selectedDay}`, 'true')
    setOpenedDays((current) => new Set(current).add(selectedDay))
  }
  const spriteUrl = slides[step].sprite.toLowerCase()
  const hasPokemonSparkles = !spriteUrl.includes('.gif')
  const isPngSprite = spriteUrl.includes('.png')
  const pokemonSprite = (
    <img
      src={slides[step].sprite}
      alt={slides[step].pokemon}
      className={`calendar-sprite${isPngSprite ? ' calendar-sprite-png' : ''}`}
      width="112"
      height="112"
    />
  )

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
        <motion.div key={step} className="quote" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className={`calendar-date${isOpened ? '' : ' is-closed'}`}>
            <strong>{getOrdinal(selectedDay)}</strong>
            <span className="calendar-pokemon-name">{isOpened ? slides[step].pokemon : 'Mystery gift'}</span>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {isOpened ? (
              <motion.div
                key="opened-gift"
                className="calendar-content"
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="calendar-message">
                  {discordAvatar ? (
                    <img
                      className="calendar-avatar"
                      src={discordAvatar}
                      alt={`${slides[step].person}'s Discord profile`}
                    />
                  ) : (
                    <span
                      className="calendar-avatar calendar-avatar-placeholder"
                      role="img"
                      aria-label={`Discord profile picture placeholder for ${slides[step].person}`}
                    />
                  )}
                  <span className="calendar-honoree-text">
                    <span>In honor of <strong>{slides[step].person}</strong>.</span>
                    <span>{slides[step].text}</span>
                  </span>
                </div>
                <div className="calendar-pokemon">
                  <span className={`calendar-pokemon-art${hasPokemonSparkles ? ' has-sparkles' : ''}`}>
                    {slides[step].pokemonUrl
                      ? <a href={slides[step].pokemonUrl}>{pokemonSprite}</a>
                      : pokemonSprite}
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="wrapped-gift"
                type="button"
                className={`calendar-gift${canOpen ? '' : ' is-locked'}`}
                onClick={openSelectedDay}
                aria-label={canOpen ? `Open the gift for ${getOrdinal(selectedDay)}` : `Locked until ${getOrdinal(selectedDay)}`}
                disabled={!canOpen}
                exit={{ opacity: 0, y: -16, scale: 1.08, rotate: 3 }}
                transition={{ duration: 0.22, ease: 'easeIn' }}
              >
                <span className="calendar-gift-icon" aria-hidden="true">
                  <span className="calendar-gift-bow" />
                  <span className="calendar-gift-box" />
                </span>
                <span>{canOpen ? 'Open your gift' : `Locked until ${getOrdinal(selectedDay)}`}</span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
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
