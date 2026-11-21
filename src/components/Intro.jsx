import { useEffect, useState } from 'react'
import { INTRO } from '../config.js'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function useTypewriter(text, active, speed = 70) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active || count >= text.length) return
    const delay = prefersReducedMotion() ? 0 : speed
    const id = setTimeout(() => setCount((c) => c + 1), delay)
    return () => clearTimeout(id)
  }, [active, count, text, speed])

  return [text.slice(0, count), count >= text.length]
}

export default function Intro({ onDone }) {
  const [stage, setStage] = useState('ask')
  const [line1, done1] = useTypewriter(INTRO.line1, true)
  const [line2, done2] = useTypewriter(INTRO.line2, done1)

  useEffect(() => {
    if (stage !== 'achievement' || !prefersReducedMotion()) return
    const id = setTimeout(onDone, 2500)
    return () => clearTimeout(id)
  }, [stage, onDone])

  const onYes = () => setStage('achievement')

  return (
    <main className="intro">
      <div className="book">
        <img src="/images/minecraft-intro-page.png" alt="" />
        <div className="book-text">
          <p className="book-line1">
            {line1}
            <span className="cursor" aria-hidden="true" />
          </p>
          <p className="book-line2">{line2}</p>
        </div>
        {done2 && (
          <button className="yes" autoFocus onClick={onYes} disabled={stage !== 'ask'}>
            YES
          </button>
        )}
      </div>

      {stage === 'achievement' && (
        <div className="toast" role="status" onAnimationEnd={onDone}>
          <img src="/images/oshawott.png" alt="" />
          <div>
            <p className="toast-title">New achievement made!</p>
            <p className="toast-sub">The Start?</p>
          </div>
        </div>
      )}
    </main>
  )
}
