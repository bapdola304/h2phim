export function GenreChips({ genres, active, onChange }) {
  return (
    <div className="movie-chips" role="group" aria-label="Lọc thể loại">
      {genres.map((g) => (
        <button
          key={g}
          type="button"
          className={`movie-chip${active === g ? ' movie-chip--active' : ''}`}
          onClick={() => onChange(g)}
          aria-pressed={active === g}
        >
          {g}
        </button>
      ))}
    </div>
  )
}
