import { motion } from 'motion/react'
import { spriteSrc } from '../sprites.js'





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
            <img key={i} src={spriteSrc(sprite)} alt="" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      )}
      {children}
    </motion.section>
  )
}
