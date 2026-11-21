import { useEffect, useRef, useState } from 'react'
import Chips from '../components/Chips.jsx'
import ImageCarousel from '../components/ImageCarousel.jsx'
import Panel from '../components/Panel.jsx'
import issues from '../data/archive.json'

const SORTS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
]

export default function Archive() {
  const [order, setOrder] = useState('newest')
  const [viewerIndex, setViewerIndex] = useState(null)
  const triggerRef = useRef(null)

  const sorted = [...issues].sort((a, b) =>
    order === 'newest' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date),
  )
  const slides = sorted.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.date,
    src: issue.image ? `/images/archive/${issue.image}` : null,
    alt: issue.title,
    placeholderText: 'Newspaper image placeholder',
    aspectRatio: '3 / 4',
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
      <Panel tone="yellow" sprite="furret" className="page-head">
        <h1>Newspaper archive</h1>
        <p>Expired hub newspapers from the server.</p>
        <Chips label="Sort:" options={SORTS} value={order} onChange={setOrder} />
      </Panel>

      <Panel sprite="mudkip" count={3}>
        <div className="inset grid grid-archive">
          {sorted.map((i, index) => (
            <article key={i.id} className="card">
              <button
                type="button"
                className="image-trigger"
                aria-label={`Enlarge ${i.title} newspaper`}
                onClick={(event) => openImage(event, index)}
              >
                {i.image ? (
                  <img className="newspaper" src={`/images/archive/${i.image}`} alt="" />
                ) : (
                  <div className="newspaper placeholder">NEWSPAPER IMAGE</div>
                )}
              </button>
              <h3>{i.title}</h3>
              <p className="muted">{i.date}</p>
            </article>
          ))}
        </div>
      </Panel>

      {viewerIndex !== null && (
        <ImageCarousel
          slides={slides}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
          variant="archive-image-viewer"
        />
      )}
    </>
  )
}
