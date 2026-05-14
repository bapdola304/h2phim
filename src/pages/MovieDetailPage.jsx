import { useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { DetailCast } from '../components/movie/DetailCast'
import { DetailToolbar } from '../components/movie/DetailToolbar'
import { MoviePlayer } from '../components/movie/MoviePlayer'
import { MovieRow } from '../components/movie/MovieRow'
import { getMovieById, getRelatedMovies } from '../data/movies'

export default function MovieDetailPage() {
  const { id } = useParams()
  const movie = getMovieById(id)
  const [playing, setPlaying] = useState(false)
  const playerAnchor = useRef(null)

  console.log({movie});
  

  useEffect(() => {
    setPlaying(false)
  }, [id])

  useEffect(() => {
    if (!playing) return
    playerAnchor.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [playing])

  if (!movie) {
    return <Navigate to="/browse" replace />
  }

  const related = getRelatedMovies(movie, 8)

  return (
    <div className="movie-page-enter movie-detail-page">
      <DetailToolbar />

      <section className="movie-detail-hero" aria-labelledby="detail-title">
        <div
          className="movie-detail-hero__bg"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        />
        <div className="movie-detail-hero__overlay" />
        <div className="movie-detail-hero__inner">
          <p className="movie-detail-hero__eyebrow">{movie.genre}</p>
          <h1 id="detail-title" className="movie-detail-hero__title">
            {movie.title}
          </h1>
          <div className="movie-detail-hero__meta">
            <span>
              <strong>IMDb</strong> {movie.rating}
            </span>
            <span>{movie.year}</span>
            <span>{movie.duration}</span>
          </div>
        </div>
      </section>

      <div className="movie-detail-content">
        <div ref={playerAnchor} id="watch" className="movie-detail-watch">
          {playing ? (
            <MoviePlayer
              src={movie.videoUrl}
              poster={movie.poster}
              title={movie.title}
            />
          ) : (
            <div
              className="movie-player-placeholder"
              style={{ backgroundImage: `url(${movie.backdrop})` }}
            >
              <div className="movie-player-placeholder__shade" />
              <div className="movie-player-placeholder__body">
                <button
                  type="button"
                  className="movie-btn movie-btn--primary movie-player-placeholder__play"
                  onClick={() => setPlaying(true)}
                >
                  ▶ Xem phim
                </button>
                <p className="movie-player-placeholder__note">
                  Bấm để mở trình phát HTML5 (video mẫu). Thiết kế tham chiếu màn chi tiết / watch trên Figma
                  community.
                </p>
              </div>
            </div>
          )}
        </div>

        <section className="movie-detail-block" aria-labelledby="synopsis-heading">
          <h2 id="synopsis-heading" className="movie-detail-block__title">
            Giới thiệu
          </h2>
          <p className="movie-detail-synopsis">{movie.synopsis}</p>
        </section>

        <DetailCast cast={movie.cast} />

        {related.length > 0 && (
          <MovieRow title="Có thể bạn cũng thích" movies={related} showBrowseLink={false} />
        )}
      </div>
    </div>
  )
}
