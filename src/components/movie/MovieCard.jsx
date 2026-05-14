import { Link } from 'react-router-dom'

export function MovieCard({ movie, variant = 'row', asLink = true, id }) {
  const cls = `movie-card${variant === 'grid' ? ' movie-card--grid' : ''}`
  const rootId = id ? { id } : {}
  const body = (
    <>
      <div className="movie-card__poster-wrap">
        <img
          className="movie-card__poster"
          src={movie.poster}
          alt={`Poster ${movie.title}`}
          loading="lazy"
        />
      </div>
      <div className="movie-card__body">
        <div className="movie-card__name">{movie.title}</div>
        <div className="movie-card__sub">
          {movie.year} · {movie.genre}
        </div>
        {variant === 'grid' && (
          <p className="movie-card__synopsis">{movie.synopsis}</p>
        )}
      </div>
    </>
  )

  if (asLink && movie.slug) {
    return (
      <Link to={`/phim/${encodeURIComponent(movie.slug)}`} className={cls} {...rootId}>
        {body}
      </Link>
    )
  }

  if (asLink) {
    return (
      <Link to={`/movie/${movie.id}`} className={cls} {...rootId}>
        {body}
      </Link>
    )
  }

  return (
    <article className={cls} {...rootId}>
      {body}
    </article>
  )
}
