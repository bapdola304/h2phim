import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { DetailToolbar } from '../components/movie/DetailToolbar'
import { OphimEmbed } from '../components/movie/OphimEmbed'
import { OphimEpisodePicker } from '../components/movie/OphimEpisodePicker'
import {
  normalizeOphimServers,
  ophimImageUrl,
  ophimWatchUrl,
} from '../lib/ophim'
import { useOphimPhim } from '../hooks/useOphimPhim'

function formatRating(item) {
  const v = item?.imdb?.vote_average ?? item?.tmdb?.vote_average
  if (typeof v === 'number' && !Number.isNaN(v)) return v.toFixed(1)
  return '—'
}

export default function OphimMoviePage() {
  const { slug: slugParam } = useParams()
  const slug = slugParam ? decodeURIComponent(slugParam) : ''
  const { data, loading, error, reload } = useOphimPhim(slug)

  const item = data?.item
  const cdn = data?.APP_DOMAIN_CDN_IMAGE ?? 'https://img.ophim.live'
  const frontend = data?.APP_DOMAIN_FRONTEND ?? 'https://ophim1.com'

  const servers = useMemo(() => (item ? normalizeOphimServers(item) : []), [item])

  const [serverIndex, setServerIndex] = useState(0)
  const [episodeIndex, setEpisodeIndex] = useState(0)

  useEffect(() => {
    setServerIndex(0)
    setEpisodeIndex(0)
  }, [item?._id])

  useEffect(() => {
    const s = servers[serverIndex]
    if (!s?.eps?.length) return
    setEpisodeIndex((ei) => Math.min(ei, s.eps.length - 1))
  }, [serverIndex, servers])

  useEffect(() => {
    const head = data?.seoOnPage?.titleHead
    if (!head) return undefined
    const prev = document.title
    document.title = head
    return () => {
      document.title = prev
    }
  }, [data?.seoOnPage?.titleHead])

  const onPick = (si, ei) => {
    setServerIndex(si)
    setEpisodeIndex(ei)
  }

  const currentEp = servers[serverIndex]?.eps?.[episodeIndex]
  const embedSrc = currentEp?.link_embed || ''

  const heroImage = item
    ? ophimImageUrl(cdn, item.poster_url || item.thumb_url)
    : ''

  const categoryStr = Array.isArray(item?.category)
    ? item.category.map((c) => c.name).filter(Boolean).join(' · ')
    : ''
  const countryStr = Array.isArray(item?.country)
    ? item.country.map((c) => c.name).filter(Boolean).join(', ')
    : ''

  const people = [
    ...(Array.isArray(item?.director) ? item.director.filter(Boolean) : []),
    ...(Array.isArray(item?.actor) ? item.actor.filter(Boolean) : []),
  ].filter(Boolean)

  if (!slug) {
    return <Navigate to="/browse" replace />
  }

  if (!loading && error && !item) {
    return (
      <div className="movie-page-enter movie-detail-page">
        <DetailToolbar />
        <div className="ophim-detail-fallback">
          <p>{error}</p>
          <div className="ophim-detail__actions">
            <button type="button" className="movie-btn movie-btn--ghost" onClick={() => reload()}>
              Thử lại
            </button>
            <Link to="/browse" className="movie-btn movie-btn--primary">
              Về khám phá
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!loading && !item) {
    return <Navigate to="/browse" replace />
  }

  return (
    <div className="movie-page-enter movie-detail-page ophim-detail">
      <DetailToolbar />

      {loading && (
        <p className="home-api-status" role="status">
          Đang tải chi tiết phim…
        </p>
      )}

      {item && (
        <>
          <section className="movie-detail-hero" aria-labelledby="ophim-detail-title">
            <div
              className="movie-detail-hero__bg"
              style={{ backgroundImage: heroImage ? `url(${heroImage})` : 'none' }}
            />
            <div className="movie-detail-hero__overlay" />
            <div className="movie-detail-hero__inner">
              <p className="movie-detail-hero__eyebrow">{categoryStr || 'OPhim'}</p>
              <h1 id="ophim-detail-title" className="movie-detail-hero__title">
                {item.name}
              </h1>
              <div className="movie-detail-hero__meta">
                <span>
                  <strong>Điểm</strong> {formatRating(item)}
                </span>
                <span>{item.year}</span>
                <span>{item.time || item.episode_current}</span>
                <span>{[item.quality, item.lang].filter(Boolean).join(' · ')}</span>
              </div>
              {countryStr && <p className="ophim-detail__country">{countryStr}</p>}
            </div>
          </section>

          <div className="movie-detail-content">
            <div className="ophim-detail__actions">
              <a
                href={ophimWatchUrl(frontend, item.slug)}
                className="movie-btn movie-btn--ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mở trên OPhim
              </a>
              {item.trailer_url && /^https?:\/\//i.test(item.trailer_url) && (
                <a
                  href={item.trailer_url}
                  className="movie-btn movie-btn--ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Trailer
                </a>
              )}
            </div>

            {embedSrc ? (
              <>
                <section className="movie-detail-block" aria-labelledby="watch-heading">
                  <h2 id="watch-heading" className="movie-detail-block__title">
                    Xem phim
                  </h2>
                  <OphimEmbed src={embedSrc} title={item.name} />
                </section>
                <OphimEpisodePicker
                  servers={servers}
                  serverIndex={serverIndex}
                  episodeIndex={episodeIndex}
                  onPick={onPick}
                />
              </>
            ) : (
              <p className="movie-empty">Chưa có nguồn phát cho phim này.</p>
            )}

            {item.content && (
              <section className="movie-detail-block" aria-labelledby="content-heading">
                <h2 id="content-heading" className="movie-detail-block__title">
                  Giới thiệu
                </h2>
                <div
                  className="ophim-html"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </section>
            )}

            {people.length > 0 && (
              <section className="movie-detail-block" aria-labelledby="people-heading">
                <h2 id="people-heading" className="movie-detail-block__title">
                  Đạo diễn và diễn viên
                </h2>
                <ul className="ophim-detail__people">
                  {people.map((name) => (
                    <li key={name} className="ophim-detail__person">
                      {name}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </>
      )}
    </div>
  )
}
