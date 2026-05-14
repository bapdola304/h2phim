export function DetailCast({ cast }) {
  if (!cast?.length) return null

  return (
    <section className="movie-detail-block" aria-labelledby="cast-heading">
      <h2 id="cast-heading" className="movie-detail-block__title">
        Diễn viên và ê-kíp
      </h2>
      <ul className="movie-detail-cast">
        {cast.map((c) => (
          <li key={`${c.name}-${c.role}`} className="movie-detail-cast__item">
            <span className="movie-detail-cast__avatar" aria-hidden>
              {c.name.slice(0, 1)}
            </span>
            <div>
              <div className="movie-detail-cast__name">{c.name}</div>
              <div className="movie-detail-cast__role">{c.role}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
