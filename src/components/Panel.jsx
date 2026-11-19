import { motion } from 'motion/react'

// One of the big rounded panels the pages are built from.
// Panels zigzag left/right automatically (see .stage in styles.css).
//   tone:   'cream' (default) or 'yellow'
//   sprite: name of a file in /images/sprites/ shown in the empty space beside the panel
//   count:  how many copies of the sprite to stack (like a little squad)
export default function Panel({ tone = 'cream', sprite, count = 1, className = '', children }) {
  return (
    <motion.section
      className={`panel panel-${tone} ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
    >
      {sprite && (
        <div className="gutter" aria-hidden="true">
          {Array.from({ length: count }, (_, i) => (
            <img key={i} src={`/images/sprites/${sprite}.png`} alt="" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      )}
      {children}
    </motion.section>
  )
}
