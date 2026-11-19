import Panel from '../components/Panel.jsx'
import ProfileCards from '../components/ProfileCards.jsx'
import faq from '../data/faq.json'

export default function Support() {
  return (
    <>
      <Panel tone="yellow" sprite="pikachu" className="page-head">
        <h1>Support</h1>
        <p>Stuck, confused or found a bug? Reach us on Discord, or check the common questions first.</p>
      </Panel>

      <Panel sprite="oshawott" count={2} className="team">
        <div className="team-head">
          <p className="kicker">Talk to a real person</p>
          <h2 className="title-lg">Talk to us</h2>
        </div>
        <ProfileCards />
      </Panel>

      <Panel sprite="rowlet">
        <h2 className="title-lg">Common questions</h2>
        <div className="inset faq-list">
          {faq.map((item) => (
            <details key={item.question} className="card faq">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </Panel>
    </>
  )
}
