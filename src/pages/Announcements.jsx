import { useMemo, useState } from 'react'
import Chips from '../components/Chips.jsx'
import posts from '../data/announcements.json'

const PRIORITIES = [
  { id: 'critical', label: 'CRITICAL', color: 'var(--orange)' },
  { id: 'moderate', label: 'MODERATE', color: 'var(--lavender)' },
  { id: 'nice', label: 'NICE TO KNOW', color: 'var(--lime)' },
]

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'event', label: 'Events' },
  { id: 'changelog', label: 'Modpack changelogs' },
]

const TYPE_LABEL = { event: 'EVENT', changelog: 'MODPACK CHANGELOG' }

export default function Announcements() {
  const [filter, setFilter] = useState('all')

  // Priority order first, newest first inside each priority.
  const groups = useMemo(
    () =>
      PRIORITIES.map((p) => ({
        ...p,
        items: posts
          .filter((a) => a.priority === p.id && (filter === 'all' || a.type === filter))
          .sort((a, b) => b.date.localeCompare(a.date)),
      })).filter((g) => g.items.length > 0),
    [filter],
  )

  return (
    <>
      <h1>Announcements</h1>
      <Chips label="Show:" options={FILTERS} value={filter} onChange={setFilter} />

      {groups.map((g) => (
        <section key={g.id}>
          <h2 className="group-head">
            <span className="tag pixel" style={{ background: g.color }}>{g.label}</span>
          </h2>
          {g.items.map((a) => (
            <article key={a.id} className="card pixel">
              <div className="card-top">
                <span className="tag pixel small">{TYPE_LABEL[a.type]}</span>
                <span>{a.date}</span>
              </div>
              <h3>{a.title}</h3>
              <p>{a.body}</p>
              <p className="muted">By {a.author}</p>
            </article>
          ))}
        </section>
      ))}
    </>
  )
}
