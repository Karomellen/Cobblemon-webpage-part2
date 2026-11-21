import { useEffect, useRef, useState } from 'react'
import ImageCarousel from '../components/ImageCarousel.jsx'
import Panel from '../components/Panel.jsx'

const STEPS = Array.from({ length: 5 }, (_, index) => ({
  number: index + 1,
  title: `Step ${index + 1}`,
  description: 'Add instructions for this step.',
  placeholderText: `Screenshot placeholder for step ${index + 1}`,
}))

export default function Installation() {
  const [viewerIndex, setViewerIndex] = useState(null)
  const triggerRef = useRef(null)
  const slides = STEPS.map((step) => ({
    title: step.title,
    description: step.description,
    placeholderText: step.placeholderText,
    aspectRatio: '16 / 9',
  }))

  useEffect(() => {
    if (viewerIndex === null) triggerRef.current?.focus()
  }, [viewerIndex])

  const openImage = (event, index) => {
    triggerRef.current = event.currentTarget
    setViewerIndex(index)
  }

  return (
    <>
      <Panel tone="yellow" sprite="pikachu" className="page-head">
        <h1>Installation tutorial</h1>
        <p>Follow these steps to install the Cobblemon modpack. Screenshots and instructions can be added to each step.</p>
      </Panel>

      <Panel sprite="mudkip">
        <div className="grid install-steps">
          {STEPS.map((step) => (
            <article key={step.number} className="card install-step">
              <h2>{step.title}</h2>
              <button
                type="button"
                className="image-trigger"
                aria-label={`Enlarge screenshot for ${step.title}`}
                onClick={(event) => openImage(event, step.number - 1)}
              >
                <div className="install-image-placeholder" aria-hidden="true">
                  Screenshot placeholder
                </div>
              </button>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </Panel>

      {viewerIndex !== null && (
        <ImageCarousel
          slides={slides}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </>
  )
}
