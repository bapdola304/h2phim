import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

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

function normalizeSlides(movies, movie) {
  if (Array.isArray(movies) && movies.length > 0) return movies.filter(Boolean)
  if (movie) return [movie]
  return []
}

export function Hero({ movie, movies, variant = 'default', children }) {
  const slides = useMemo(() => normalizeSlides(movies, movie), [movies, movie])
  const reducedMotion = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStart = useRef(null)

  const slideCount = slides.length
  const current = slides[Math.min(index, slideCount - 1)] ?? null

  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, slideCount - 1)))
  }, [slideCount])

  useEffect(() => {
    if (slideCount <= 1 || paused || reducedMotion) return undefined
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % slideCount)
    }, AUTO_MS)
    return () => window.clearInterval(t)
  }, [slideCount, paused, reducedMotion])

  const go = useCallback(
    (dir) => {
      if (slideCount <= 1) return
      setIndex((i) => {
        if (dir === 'next') return (i + 1) % slideCount
        return (i - 1 + slideCount) % slideCount
      })
    },
    [slideCount],
  )

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0]?.clientX ?? null
  }
  const onTouchEnd = (e) => {
    const start = touchStart.current
    touchStart.current = null
    if (start == null || slideCount <= 1) return
    const end = e.changedTouches[0]?.clientX
    if (end == null) return
    const dx = end - start
    if (dx < -48) go('next')
    else if (dx > 48) go('prev')
  }

  if (!current) return null

  const isHome = variant === 'home'
  const showSlider = isHome && slideCount > 1

  return (
    <section
      className={`movie-hero${isHome ? ' movie-hero--home' : ''}${showSlider ? ' movie-hero--slider' : ''}`}
      aria-labelledby="hero-title"
      aria-roledescription={showSlider ? 'carousel' : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {showSlider ? (
        <div className="movie-hero__slides">
          <div
            className="movie-hero__slides-track"
            style={{
              width: `${slideCount * 100}%`,
              transform: `translateX(-${(index * 100) / slideCount}%)`,
            }}
          >
            {slides.map((m) => (
              <div
                key={m.id ?? m.slug}
                className="movie-hero__slide"
                style={{ flex: `0 0 ${100 / slideCount}%` }}
              >
                <div
                  className="movie-hero__bg"
                  style={{ backgroundImage: `url(${m.backdrop || m.poster})` }}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="movie-hero__bg"
          style={{ backgroundImage: `url(${current.backdrop || current.poster})` }}
          role="img"
          aria-label=""
        />
      )}
      <div className="movie-hero__overlay" />
      <div className={`movie-hero__shell${isHome ? ' movie-hero__shell--split' : ''}`}>
        <div className="movie-hero__content">
          {children}
          <p className="movie-hero__eyebrow">Gợi ý cho bạn</p>
          <div {...(showSlider ? { 'aria-live': 'polite', 'aria-atomic': true } : {})}>
            <h1 id="hero-title" className="movie-hero__heading">
              {current.title}
            </h1>
            <div className="movie-hero__meta">
              <span>
                <strong>IMDb</strong> {current.rating}
              </span>
              <span>{current.year}</span>
              <span>{current.duration}</span>
              <span>{current.genre}</span>
            </div>
            <p className="movie-hero__desc">{current.synopsis}</p>
          </div>
          <div className="movie-hero__actions">
            {current.slug ? (
              <Link
                to={`/phim/${encodeURIComponent(current.slug)}`}
                className="movie-btn movie-btn--primary"
              >
                ▶ Chi tiết phim
              </Link>
            ) : (
              <Link to={`/movie/${current.id}`} className="movie-btn movie-btn--primary">
                ▶ Xem phim
              </Link>
            )}
          </div>
          {showSlider && (
            <div className="movie-hero__slider-ui" role="group" aria-label="Chọn slide">
              <div className="movie-hero__dots">
                {slides.map((m, i) => (
                  <button
                    key={m.id ?? m.slug}
                    type="button"
                    className={`movie-hero__dot${i === index ? ' movie-hero__dot--active' : ''}`}
                    aria-label={`Slide ${i + 1}: ${m.title}`}
                    aria-current={i === index ? 'true' : undefined}
                    onClick={() => setIndex(i)}
                  />
                ))}
              </div>
              {!reducedMotion && (
                <div
                  className="movie-hero__progress"
                  aria-hidden
                  key={index}
                  style={{ animationDuration: `${AUTO_MS}ms` }}
                />
              )}
            </div>
          )}
        </div>
        {isHome && (
          <div className="movie-hero__visual" aria-hidden="true">
            <div className="movie-hero__poster-ring" />
            <img
              className="movie-hero__poster-img"
              src={current.poster}
              alt=""
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        )}
      </div>
      {showSlider && (
        <>
          <button
            type="button"
            className="movie-hero__nav movie-hero__nav--prev"
            aria-label="Slide trước"
            onClick={() => go('prev')}
          />
          <button
            type="button"
            className="movie-hero__nav movie-hero__nav--next"
            aria-label="Slide sau"
            onClick={() => go('next')}
          />
        </>
      )}
    </section>
  )
}
