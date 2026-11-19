import { useState } from 'react'
import Chips from '../components/Chips.jsx'
import Panel from '../components/Panel.jsx'
import issues from '../data/archive.json'

const SORTS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
]

export default function Archive() {
  const [order, setOrder] = useState('newest')

  const sorted = [...issues].sort((a, b) =>
    order === 'newest' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date),
  )

  return (
    <>
      <Panel tone="yellow" sprite="furret" className="page-head">
        <h1>Newspaper archive</h1>
        <p>Expired hub newspapers from the server.</p>
        <Chips label="Sort:" options={SORTS} value={order} onChange={setOrder} />
      </Panel>

      <Panel sprite="mudkip" count={3}>
        <div className="inset grid grid-archive">
          {sorted.map((i) => (
            <article key={i.id} className="card">
              {i.image ? (
                <img className="newspaper" src={`/images/archive/${i.image}`} alt={i.title} />
              ) : (
                <div className="newspaper placeholder">NEWSPAPER IMAGE</div>
              )}
              <h3>{i.title}</h3>
              <p className="muted">{i.date}</p>
            </article>
          ))}
        </div>
      </Panel>
    </>
  )
}
