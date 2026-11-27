import Panel from '../components/Panel.jsx'
import { categories, consequences } from '../data/rules.json'

const CATEGORY_SPRITES = ['pikachu', 'rowlet', 'mudkip', 'oshawott', 'furret']

export default function Rules() {
  return (
    <>
      <Panel tone="yellow" sprite="oshawott" count={2} className="page-head">
        <h1>Rules</h1>
      </Panel>

      {categories.map((c, index) => (
        <Panel key={c.title} sprite={CATEGORY_SPRITES[index % CATEGORY_SPRITES.length]} count={2}>
          <h2 className="group-head">
            <span className="tag" style={{ background: 'var(--brown)', color: 'var(--yellow)' }}>{c.title}</span>
          </h2>
          <article className="card">
            <ul>
              {c.rules.map((rule) => (
                <li key={typeof rule === 'string' ? rule : rule.mention}>
                  {typeof rule === 'string' ? rule : (
                    <>
                      {rule.before}
                      <a href={rule.url} target="_blank" rel="noreferrer">{rule.mention}</a>
                      {rule.after}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </article>
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
