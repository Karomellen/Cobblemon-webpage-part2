import { useMemo, useState } from 'react'
import Chips from '../components/Chips.jsx'
import Panel from '../components/Panel.jsx'
import posts from '../data/announcements.json'

const PRIORITIES = [
  { id: 'critical', label: 'CRITICAL', color: 'var(--red)', text: '#fff', sprite: 'pikachu' },
  { id: 'moderate', label: 'MODERATE', color: 'var(--orange)', sprite: 'mudkip' },
  { id: 'nice', label: 'NICE TO KNOW', color: 'var(--blue-soft)', sprite: 'furret' },
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
      <Panel tone="yellow" sprite="rowlet" className="page-head">
        <h1>Announcements</h1>
        <Chips label="Show:" options={FILTERS} value={filter} onChange={setFilter} />
      </Panel>

      {groups.map((g) => (
        <Panel key={g.id} sprite={g.sprite} count={3}>
          <h2 className="group-head">
            <span className="tag" style={{ background: g.color, color: g.text }}>{g.label}</span>
          </h2>
          {g.items.map((a) => (
            <article key={a.id} className="card">
              <div className="card-top">
                <span className="tag small">{TYPE_LABEL[a.type]}</span>
                <span className="muted">{a.date}</span>
              </div>
              <h3>{a.title}</h3>
              <p>{a.body}</p>
              <p className="muted">By {a.author}</p>
            </article>
          ))}
        </Panel>
      ))}
    </>
  )
}
