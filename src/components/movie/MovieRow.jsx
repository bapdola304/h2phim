import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MovieCard } from './MovieCard'

const AUTO_MS = 6500

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return reduced
}

export function MovieRow({ title, movies, id, showBrowseLink = true, slug }) {
  const reducedMotion = usePrefersReducedMotion()
  const [startIndex, setStartIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [metrics, setMetrics] = useState({ step: 0, maxStart: 0, visible: 1 })
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const touchStart = useRef(null)
  const metricsRef = useRef(metrics)

  metricsRef.current = metrics

  const measure = useCallback(() => {
    const vp = viewportRef.current
    const tr = trackRef.current
    if (!vp || !tr || !tr.children.length) {
      setMetrics({ step: 0, maxStart: 0, visible: 1 })
      return
    }
    const c0 = tr.children[0]
    const c1 = tr.children[1]
    const step = c1 ? c1.offsetLeft - c0.offsetLeft : c0.getBoundingClientRect().width
    const safeStep = Math.max(step, 1)
    const visible = Math.max(1, Math.floor(vp.clientWidth / safeStep))
    const maxStart = Math.max(0, movies.length - visible)
    setMetrics({ step: safeStep, maxStart, visible })
    setStartIndex((s) => Math.min(s, maxStart))
  }, [movies.length])

  useLayoutEffect(() => {
    measure()
  }, [measure, movies])

  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return undefined
    const ro = new ResizeObserver(() => measure())
    ro.observe(vp)
    return () => ro.disconnect()
  }, [measure])

  const goNext = useCallback(() => {
    setStartIndex((s) => {
      const { maxStart, visible } = metricsRef.current
      if (maxStart <= 0) return 0
      if (s >= maxStart) return 0
      return Math.min(maxStart, s + visible)
    })
  }, [])

  const goPrev = useCallback(() => {
    setStartIndex((s) => {
      const { maxStart, visible } = metricsRef.current
      if (maxStart <= 0) return 0
      if (s <= 0) return maxStart
      return Math.max(0, s - visible)
    })
  }, [])

  useEffect(() => {
    if (metrics.maxStart <= 0 || paused || reducedMotion) return undefined
    const t = window.setInterval(goNext, AUTO_MS)
    return () => window.clearInterval(t)
  }, [metrics.maxStart, metrics.visible, paused, reducedMotion, goNext])

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0]?.clientX ?? null
  }
  const onTouchEnd = (e) => {
    const start = touchStart.current
    touchStart.current = null
    if (start == null || metricsRef.current.maxStart <= 0) return
    const end = e.changedTouches[0]?.clientX
    if (end == null) return
    const dx = end - start
    if (dx < -48) goNext()
    else if (dx > 48) goPrev()
  }

  if (!movies?.length) return null

  const allLinkTo = slug
    ? `/danh-sach/${encodeURIComponent(String(slug).trim())}`
    : '/browse'

  const showNav = metrics.maxStart > 0
  const offsetPx = startIndex * metrics.step

  return (
    <section className="movie-section" id={id}>
      <div className="movie-section__head">
        <h2 className="movie-section__title">{title}</h2>
        {showBrowseLink && (
          <Link to={allLinkTo} className="movie-section__link">
            Tất cả →
          </Link>
        )}
      </div>
      <div
        className="movie-row movie-row--slider"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div ref={viewportRef} className="movie-row__viewport">
          <div
            ref={trackRef}
            className="movie-row__track"
            role="list"
            style={{
              transform: `translateX(-${offsetPx}px)`,
            }}
          >
            {movies.map((m) => (
              <div key={m.slug || m.id} role="listitem" className="movie-row__cell">
                <MovieCard movie={m} variant="row" />
              </div>
            ))}
          </div>
        </div>
        {showNav && (
          <>
            <button
              type="button"
              className="movie-row__nav movie-row__nav--prev"
              aria-label="Xem các phim trước"
              onClick={goPrev}
            />
            <button
              type="button"
              className="movie-row__nav movie-row__nav--next"
              aria-label="Xem các phim sau"
              onClick={goNext}
            />
          </>
        )}
      </div>
    </section>
  )
}
