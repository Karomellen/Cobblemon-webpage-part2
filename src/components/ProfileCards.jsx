import { motion } from 'motion/react'
import { PROFILES } from '../config.js'

const SPRITES = ['pikachu', 'rowlet', 'furret', 'mudkip', 'oshawott']

// Discord contacts as orange "character select" cards. Without a url the handle is plain text.
export default function ProfileCards() {
  return (
    <div className="profiles">
      {PROFILES.map((p, i) => (
        <motion.article key={p.handle} className="profile" whileHover={{ y: -8, rotate: i % 2 ? 1.5 : -1.5 }}>
          <div className="portrait">
            <img src={`/images/sprites/${SPRITES[i % SPRITES.length]}.png`} alt="" />
          </div>
          <h3 className="handle">{p.handle}</h3>
          <p className="role">{p.role}</p>
          {p.url && (
            <a className="btn small" href={p.url} target="_blank" rel="noreferrer">
              Discord profile
            </a>
          )}
        </motion.article>
      ))}
    </div>
  )
}
