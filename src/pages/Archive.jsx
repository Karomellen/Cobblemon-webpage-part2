import { useEffect, useRef, useState } from 'react'
import ImageCarousel from '../components/ImageCarousel.jsx'
import Panel from '../components/Panel.jsx'

const API = import.meta.env.VITE_API_BASE ?? ''
const INITIAL_VISIBLE_COUNT = 3
const VISIBLE_INCREMENT = 3

function formatArchiveDate(value) {
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

function ArchiveAttribution({ issue, showSubtext = false }) {
  const uploaderName = issue.uploader_username || 'Discord user'

  return (
    <>
      <p className="muted">{formatArchiveDate(issue.date)}</p>
      {issue.uploader_discord_id && (
        <div className="archive-uploader">
          {issue.uploader_avatar_url ? (
            <img
              className="calendar-avatar"
              src={issue.uploader_avatar_url}
              alt={`${uploaderName}'s profile`}
              loading="lazy"
            />
          ) : (
            <span
              className="calendar-avatar calendar-avatar-placeholder"
              role="img"
              aria-label={`Discord profile picture placeholder for ${uploaderName}`}
            />
          )}
          <p className="muted">
            Uploaded by{' '}
            <a
              href={`https://discord.com/users/${encodeURIComponent(issue.uploader_discord_id)}`}
              target="_blank"
              rel="noreferrer"
            >
              {uploaderName}
            </a>
          </p>
        </div>
      )}
      {showSubtext && <span>{issue.subtext}</span>}
    </>
  )
}

export default function Archive() {
  const [sort, setSort] = useState('newest')
  const [uploaderId, setUploaderId] = useState('')
  const [uploaders, setUploaders] = useState([])
  const [uploadersLoadState, setUploadersLoadState] = useState('loading')
  const [page, setPage] = useState(1)
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)
  const [hasMore, setHasMore] = useState(false)
  const [viewerIndex, setViewerIndex] = useState(null)
  const [issues, setIssues] = useState([])
  const [loadState, setLoadState] = useState('loading')
  const triggerRef = useRef(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${API}/api/archive/uploaders`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Uploader list is unavailable.')
        return response.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('Uploader list is invalid.')
        setUploaders(data)
        setUploadersLoadState('loaded')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setUploadersLoadState('error')
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams({ page: String(page), sort })
    if (uploaderId) params.set('uploader', uploaderId)

    fetch(`${API}/api/archive?${params}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Archive is unavailable.')
        return response.json()
      })
      .then((data) => {
        if (!data || !Array.isArray(data.items) || typeof data.hasMore !== 'boolean') {
          throw new Error('Archive response is invalid.')
        }
        setIssues(data.items)
        setHasMore(data.hasMore)
        setVisibleCount(INITIAL_VISIBLE_COUNT)
        setLoadState('loaded')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setLoadState('error')
      })

    return () => controller.abort()
  }, [page, sort, uploaderId])

  const visibleIssues = issues.slice(0, visibleCount)
  const canLoadMore = visibleCount < issues.length
  const canLoadNextPage = !canLoadMore && hasMore
  const slides = issues.map((issue) => ({
    id: issue.id,
    title: issue.username,
    caption: <ArchiveAttribution issue={issue} showSubtext />,
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

  const changeSort = (event) => {
    setLoadState('loading')
    setSort(event.target.value)
    setPage(1)
  }

  const changeUploader = (event) => {
    setLoadState('loading')
    setUploaderId(event.target.value)
    setPage(1)
  }

  const changePage = (nextPage) => {
    setLoadState('loading')
    setPage(nextPage)
  }

  return (
    <>
      <Panel tone="yellow" sprite="furret" className="page-head">
        <h1>Newspaper archive</h1>
        <p>Newspaper entries shared by Cobblemon members.</p>
      </Panel>

      <Panel sprite="mudkip" count={3}>
        <div className="inset archive-inset">
          <div className="archive-filters">
            <label className="archive-filter" htmlFor="archive-uploader">
              <span>Uploaded by</span>
              <select
                id="archive-uploader"
                value={uploaderId}
                onChange={changeUploader}
                disabled={uploadersLoadState !== 'loaded'}
              >
                <option value="">All uploaders</option>
                {uploaders.map((uploader) => (
                  <option key={uploader.id} value={uploader.id}>{uploader.username}</option>
                ))}
              </select>
            </label>
            <label className="archive-filter" htmlFor="archive-date">
              <span>Date</span>
              <select id="archive-date" value={sort} onChange={changeSort}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </label>
          </div>
          {uploadersLoadState === 'error' && (
            <p role="alert">Could not load the uploader filter. Please try again later.</p>
          )}
          <div className="grid grid-archive">
            {loadState === 'loading' && <p role="status">Loading archive...</p>}
            {loadState === 'error' && <p role="alert">Could not load the archive. Please try again later.</p>}
            {loadState === 'loaded' && issues.length === 0 && <p>No archive entries found.</p>}
            {loadState === 'loaded' && visibleIssues.map((i, index) => (
              <article key={i.id} className="card">
                <button
                  type="button"
                  className="image-trigger"
                  aria-label={`Enlarge ${i.username}'s newspaper`}
                  onClick={(event) => openImage(event, index)}
                >
                  <img className="newspaper" src={i.image_url} alt="" loading="lazy" decoding="async" />
                </button>
                <ArchiveAttribution issue={i} />
              </article>
            ))}
          </div>
        </div>
        {loadState === 'loaded' && issues.length > 0 && (
          <nav className="archive-pagination" aria-label="Archive pagination">
            {page > 1 && (
              <button type="button" className="btn" onClick={() => changePage(page - 1)}>
                Previous page
              </button>
            )}
            {canLoadMore && (
              <button
                type="button"
                className="btn"
                onClick={() => setVisibleCount((count) => Math.min(count + VISIBLE_INCREMENT, issues.length))}
              >
                Load more
              </button>
            )}
            {canLoadNextPage && (
              <button type="button" className="btn" onClick={() => changePage(page + 1)}>
                Next page
              </button>
            )}
            {(page > 1 || canLoadNextPage) && <span>Page {page}</span>}
          </nav>
        )}
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
