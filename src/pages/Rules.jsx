import Panel from '../components/Panel.jsx'
import { categories, consequences } from '../data/rules.json'

const PRIORITIES = [
  { id: 'high', label: 'HIGH PRIORITY', color: 'var(--red)', text: '#fff', sprite: 'pikachu' },
  { id: 'medium', label: 'MEDIUM PRIORITY', color: 'var(--orange)', sprite: 'rowlet' },
  { id: 'low', label: 'LOW PRIORITY', color: 'var(--blue-soft)', sprite: 'mudkip' },
]

export default function Rules() {
  return (
    <>
      <Panel tone="yellow" sprite="oshawott" count={2} className="page-head">
        <h1>Rules</h1>
      </Panel>

      {PRIORITIES.map((p) => (
        <Panel key={p.id} sprite={p.sprite}>
          <h2 className="group-head">
            <span className="tag" style={{ background: p.color, color: p.text }}>{p.label}</span>
          </h2>
          {categories.map((c, index) =>
            c.priority !== p.id ? null : (
              <article key={c.title} className="card">
                <h3>{index + 1}. {c.title}</h3>
                <ul>
                  {c.rules.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </article>
            ),
          )}
        </Panel>
      ))}

      <Panel tone="yellow" sprite="furret" count={3}>
        <h2 className="group-head">
          <span className="tag" style={{ background: 'var(--brown)', color: 'var(--yellow)' }}>IF RULES ARE BROKEN</span>
        </h2>
        <article className="card">
          <h3>Consequences for breaking the rules</h3>
          <ul>
            {consequences.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </article>
      </Panel>
    </>
  )
}
