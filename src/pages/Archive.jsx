import { useEffect, useRef, useState } from 'react'
import Chips from '../components/Chips.jsx'
import ImageCarousel from '../components/ImageCarousel.jsx'
import Panel from '../components/Panel.jsx'

const API = import.meta.env.VITE_API_BASE ?? ''

const SORTS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
]

export default function Archive() {
  const [order, setOrder] = useState('newest')
  const [viewerIndex, setViewerIndex] = useState(null)
  const [issues, setIssues] = useState([])
  const [loadState, setLoadState] = useState('loading')
  const triggerRef = useRef(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${API}/api/archive`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Archive is unavailable.')
        return response.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Archive response is invalid.')
        setIssues(data)
        setLoadState('loaded')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setLoadState('error')
      })

    return () => controller.abort()
  }, [])

  const sorted = [...issues].sort((a, b) =>
    order === 'newest' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date),
  )
  const slides = sorted.map((issue) => ({
    id: issue.id,
    title: issue.username,
    description: `${issue.date} - ${issue.subtext}`,
    src: issue.image_url,
    alt: `${issue.username}'s newspaper`,
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
        <p>Newspaper entries shared by Cobblemon members.</p>
        <Chips label="Sort:" options={SORTS} value={order} onChange={setOrder} />
      </Panel>

      <Panel sprite="mudkip" count={3}>
        <div className="inset grid grid-archive">
          {loadState === 'loading' && <p role="status">Loading archive...</p>}
          {loadState === 'error' && <p role="alert">Could not load the archive. Please try again later.</p>}
          {loadState === 'loaded' && sorted.length === 0 && <p>No archive entries yet.</p>}
          {loadState === 'loaded' && sorted.map((i, index) => (
            <article key={i.id} className="card">
              <button
                type="button"
                className="image-trigger"
                aria-label={`Enlarge ${i.username}'s newspaper`}
                onClick={(event) => openImage(event, index)}
              >
                <img className="newspaper" src={i.image_url} alt="" />
              </button>
              <h3>{i.username}</h3>
              <p className="muted">{i.date}</p>
              <p>{i.subtext}</p>
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
