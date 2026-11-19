import { categories, consequences } from '../data/rules.json'

const PRIORITIES = [
  { id: 'high', label: 'HIGH PRIORITY', color: 'var(--orange)' },
  { id: 'medium', label: 'MEDIUM PRIORITY', color: 'var(--lavender)' },
  { id: 'low', label: 'LOW PRIORITY', color: 'var(--lime)' },
]

export default function Rules() {
  return (
    <>
      <h1>Rules</h1>

      {PRIORITIES.map((p) => (
        <section key={p.id}>
          <h2 className="group-head">
            <span className="tag pixel" style={{ background: p.color }}>{p.label}</span>
          </h2>
          {categories.map((c, index) =>
            c.priority !== p.id ? null : (
              <article key={c.title} className="card pixel">
                <h3>{index + 1}. {c.title}</h3>
                <ul>
                  {c.rules.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </article>
            ),
          )}
        </section>
      ))}

      <section>
        <h2 className="group-head">
          <span className="tag pixel" style={{ background: 'var(--peach)' }}>IF RULES ARE BROKEN</span>
        </h2>
        <article className="card pixel">
          <h3>Consequences for breaking the rules</h3>
          <ul>
            {consequences.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </article>
      </section>
    </>
  )
}
