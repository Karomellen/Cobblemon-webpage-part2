import Panel from '../components/Panel.jsx'

const STEPS = Array.from({ length: 5 }, (_, index) => index + 1)

export default function Installation() {
  return (
    <>
      <Panel tone="yellow" sprite="pikachu" className="page-head">
        <h1>Installation tutorial</h1>
        <p>Follow these steps to install the Cobblemon modpack. Screenshots and instructions can be added to each step.</p>
      </Panel>

      <Panel sprite="mudkip">
        <div className="grid install-steps">
          {STEPS.map((step) => (
            <article key={step} className="card install-step">
              <h2>Step {step}</h2>
              <div className="install-image-placeholder" aria-hidden="true">
                Screenshot placeholder
              </div>
              <p>Add instructions for this step.</p>
            </article>
          ))}
        </div>
      </Panel>
    </>
  )
}
