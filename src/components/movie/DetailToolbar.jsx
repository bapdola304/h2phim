import { Link, useNavigate } from 'react-router-dom'

export function DetailToolbar() {
  const navigate = useNavigate()

  return (
    <div className="movie-detail-toolbar">
      <button
        type="button"
        className="movie-detail-back"
        onClick={() => navigate(-1)}
      >
        ← Quay lại
      </button>
      <Link to="/browse" className="movie-detail-link">
        Khám phá
      </Link>
    </div>
  )
}
