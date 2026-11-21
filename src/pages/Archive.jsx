import { useEffect, useRef, useState } from 'react'
import Chips from '../components/Chips.jsx'
import Panel from '../components/Panel.jsx'
import issues from '../data/archive.json'

const SORTS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
]

export default function Archive() {
  const [order, setOrder] = useState('newest')
  const [activeIndex, setActiveIndex] = useState(null)
  const triggerRef = useRef(null)

  const sorted = [...issues].sort((a, b) =>
    order === 'newest' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date),
  )
  const imageIssues = sorted.filter((issue) => issue.image)
  const activeIssue = activeIndex === null ? null : imageIssues[activeIndex]

  useEffect(() => {
    if (activeIndex === null) {
      triggerRef.current?.focus()
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveIndex(null)
      } else if (imageIssues.length > 1 && event.key === 'ArrowLeft') {
        event.preventDefault()
        setActiveIndex((index) => (index - 1 + imageIssues.length) % imageIssues.length)
      } else if (imageIssues.length > 1 && event.key === 'ArrowRight') {
        event.preventDefault()
        setActiveIndex((index) => (index + 1) % imageIssues.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, imageIssues.length])

  const openImage = (event, issue) => {
    triggerRef.current = event.currentTarget
    setActiveIndex(imageIssues.findIndex((image) => image.id === issue.id))
  }

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
                <button
                  type="button"
                  className="archive-image-button"
                  aria-label={`View ${i.title} image`}
                  onClick={(event) => openImage(event, i)}
                >
                  <img className="newspaper" src={`/images/archive/${i.image}`} alt="" />
                </button>
              ) : (
                <div className="newspaper placeholder">NEWSPAPER IMAGE</div>
              )}
              <h3>{i.title}</h3>
              <p className="muted">{i.date}</p>
            </article>
          ))}
        </div>
      </Panel>

      {activeIssue && (
        <div
          className="archive-lightbox"
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveIndex(null)
          }}
        >
          <div className="archive-lightbox-content" role="dialog" aria-modal="true" aria-label="Newspaper image viewer">
            <button
              type="button"
              className="lightbox-close"
              aria-label="Close image viewer"
              autoFocus
              onClick={() => setActiveIndex(null)}
            >
              Close
            </button>
            <button
              type="button"
              className="lightbox-arrow"
              aria-label="Previous image"
              disabled={imageIssues.length < 2}
              onClick={() => setActiveIndex((index) => (index - 1 + imageIssues.length) % imageIssues.length)}
            >
              {'\u25C0'}
            </button>
            <figure className="archive-lightbox-figure">
              <img
                className="archive-lightbox-image"
                src={`/images/archive/${activeIssue.image}`}
                alt={activeIssue.title}
              />
              <figcaption>{activeIssue.title} · {activeIssue.date}</figcaption>
            </figure>
            <button
              type="button"
              className="lightbox-arrow"
              aria-label="Next image"
              disabled={imageIssues.length < 2}
              onClick={() => setActiveIndex((index) => (index + 1) % imageIssues.length)}
            >
              {'\u25B6'}
            </button>
            <p className="lightbox-counter" aria-live="polite">{activeIndex + 1} / {imageIssues.length}</p>
          </div>
        </div>
      )}
    </>
  )
}
