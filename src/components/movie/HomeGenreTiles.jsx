import { Link } from 'react-router-dom'

export function HomeGenreTiles({ tiles }) {
  if (!tiles?.length) return null

  return (
    <section className="home-genres" aria-labelledby="home-genres-title">
      <div className="movie-section__head home-genres__head">
        <h2 id="home-genres-title" className="movie-section__title">
          Duyệt theo thể loại
        </h2>
        <Link to="/browse" className="movie-section__link">
          Mở khám phá →
        </Link>
      </div>
      <div className="home-genres__grid">
        {tiles.map((t) => (
          <Link
            key={t.genre}
            to={`/browse?genre=${encodeURIComponent(t.genre)}`}
            className="home-genres__tile"
          >
            <div
              className="home-genres__bg"
              style={{ backgroundImage: `url(${t.image})` }}
              role="presentation"
            />
            <div className="home-genres__overlay" />
            <span className="home-genres__label">{t.genre}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
