import ProfileCards from '../components/ProfileCards.jsx'
import faq from '../data/faq.json'

export default function Support() {
  return (
    <>
      <h1>Support</h1>
      <p>Stuck, confused or found a bug? Reach us on Discord, or check the common questions first.</p>

      <section>
        <h2 className="section-title">Talk to us</h2>
        <ProfileCards />
      </section>

      <section>
        <h2 className="section-title">Common questions</h2>
        {faq.map((item) => (
          <details key={item.question} className="card pixel faq">
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </section>
    </>
  )
}
