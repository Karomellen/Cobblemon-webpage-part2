import { useEffect, useRef, useState } from 'react'

export default function ImageCarousel({ slides, initialIndex, onClose, variant = '' }) {
  const [index, setIndex] = useState(() => Math.max(0, Math.min(initialIndex, slides.length - 1)))
  const dialogRef = useRef(null)
  const slide = slides[index]

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      } else if (slides.length > 1 && event.key === 'ArrowLeft') {
        event.preventDefault()
        setIndex((current) => (current - 1 + slides.length) % slides.length)
      } else if (slides.length > 1 && event.key === 'ArrowRight') {
        event.preventDefault()
        setIndex((current) => (current + 1) % slides.length)
      } else if (event.key === 'Tab') {
        const controls = dialogRef.current?.querySelectorAll('button:not(:disabled)')
        if (!controls?.length) return

        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, slides.length])

  const goTo = (direction) => {
    setIndex((current) => (current + direction + slides.length) % slides.length)
  }

  return (
    <div
      className={`image-lightbox ${variant}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="image-lightbox-content"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
      >
        <button type="button" className="lightbox-close" onClick={onClose} autoFocus>
          Close
        </button>
        <button
          type="button"
          className="lightbox-arrow previous"
          aria-label="Previous image"
          disabled={slides.length < 2}
          onClick={() => goTo(-1)}
        >
          {'\u25C0'}
        </button>
        <figure className="lightbox-figure">
          {slide.src ? (
            <img className="lightbox-image" src={slide.src} alt={slide.alt || slide.title} />
          ) : (
            <div
              className="lightbox-placeholder"
              role="img"
              aria-label={slide.placeholderText}
              style={{ aspectRatio: slide.aspectRatio || '4 / 3' }}
            >
              {slide.placeholderText}
            </div>
          )}
          <figcaption className="lightbox-caption">
            <strong>{slide.title}</strong>
            {slide.description && <span>{slide.description}</span>}
          </figcaption>
        </figure>
        <button
          type="button"
          className="lightbox-arrow next"
          aria-label="Next image"
          disabled={slides.length < 2}
          onClick={() => goTo(1)}
        >
          {'\u25B6'}
        </button>
        <p className="lightbox-counter" aria-live="polite">
          {index + 1} / {slides.length}
        </p>
      </div>
    </div>
  )
}
