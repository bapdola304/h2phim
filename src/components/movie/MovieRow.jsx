import { Link } from 'react-router-dom'
import { MovieCard } from './MovieCard'

export function MovieRow({ title, movies, id, showBrowseLink = true }) {
  if (!movies?.length) return null

  return (
    <section className="movie-section" id={id}>
      <div className="movie-section__head">
        <h2 className="movie-section__title">{title}</h2>
        {showBrowseLink && (
          <Link to="/browse" className="movie-section__link">
            Tất cả →
          </Link>
        )}
      </div>
      <div className="movie-row" role="list">
        {movies.map((m) => (
          <div key={m.id} role="listitem">
            <MovieCard movie={m} variant="row" />
          </div>
        ))}
      </div>
    </section>
  )
}
