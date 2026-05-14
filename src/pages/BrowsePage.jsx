import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { GenreChips } from '../components/movie/GenreChips'
import { MovieCard } from '../components/movie/MovieCard'
import { useOphimSearch } from '../hooks/useOphimSearch'
import { filterMoviesByQuery, GENRES, getMoviesByGenre } from '../data/movies'

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const qUrl = searchParams.get('q') ?? ''
  const qTrim = qUrl.trim()

  const [localQ, setLocalQ] = useState(qUrl)

  useEffect(() => {
    setLocalQ(qUrl)
  }, [qUrl])

  const genreParam = searchParams.get('genre')
  const genre = genreParam && GENRES.includes(genreParam) ? genreParam : GENRES[0]

  const filteredLocal = useMemo(() => {
    const byGenre = getMoviesByGenre(genre)
    return filterMoviesByQuery(byGenre, qUrl)
  }, [genre, qUrl])

  const ophim = useOphimSearch(qTrim)

  const setGenre = (g) => {
    const next = new URLSearchParams(searchParams)
    if (g === GENRES[0]) next.delete('genre')
    else next.set('genre', g)
    setSearchParams(next, { replace: true })
  }

  const onSubmitSearch = (e) => {
    e.preventDefault()
    const next = new URLSearchParams(searchParams)
    const t = localQ.trim()
    if (t) next.set('q', t)
    else next.delete('q')
    setSearchParams(next, { replace: true })
  }

  const clearSearch = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('q')
    setSearchParams(next, { replace: true })
    setLocalQ('')
  }

  const hasOphimQuery = Boolean(qTrim)

  return (
    <div className="movie-page-enter movie-section" style={{ marginTop: '1.5rem' }}>
      <div className="movie-section__head browse-page__head">
        <h1 className="movie-section__title">Khám phá</h1>
        <form className="browse-search" onSubmit={onSubmitSearch} role="search">
          <input
            className="browse-search__input"
            type="search"
            value={localQ}
            onChange={(e) => setLocalQ(e.target.value)}
            placeholder="Tìm trên OPhim hoặc lọc danh sách demo…"
            aria-label="Từ khoá tìm kiếm"
          />
          <button type="submit" className="browse-search__btn">
            {hasOphimQuery ? 'Tìm OPhim' : 'Áp dụng'}
          </button>
        </form>
      </div>

      {hasOphimQuery ? (
        <>
          <div className="browse-search-meta">
            <p className="movie-browse__intro browse-search-meta__text">
              Kết quả từ API{' '}
              <code className="browse-page__code">/v1/api/tim-kiem?keyword=…</code> cho:{' '}
              <strong>{qTrim}</strong>
              {ophim.titlePage ? ` — ${ophim.titlePage}` : ''}
            </p>
            <button type="button" className="browse-clear-search" onClick={clearSearch}>
              Xóa tìm kiếm
            </button>
          </div>
          {ophim.loading && (
            <p className="home-api-status" role="status">
              Đang tìm trên OPhim…
            </p>
          )}
          {ophim.error && (
            <div className="home-api-banner home-api-banner--error" role="alert">
              <p>
                <strong>OPhim:</strong> {ophim.error}
              </p>
            </div>
          )}
          {!ophim.loading && !ophim.error && ophim.movies.length === 0 && (
            <p className="movie-empty">Không có phim khớp từ khóa.</p>
          )}
          {ophim.movies.length > 0 && (
            <div className="movie-grid browse-ophim-grid">
              {ophim.movies.map((m) => (
                <MovieCard key={m.slug || m.id} movie={m} variant="grid" />
              ))}
            </div>
          )}
          <hr className="browse-divider" />
          <h2 className="browse-subsection-title">Phim demo trong app</h2>
          <p className="movie-browse__intro">
            Lọc theo thể loại (dữ liệu tĩnh). Tham số URL:{' '}
            <code className="browse-page__code">genre</code>.
          </p>
        </>
      ) : (
        <p className="movie-browse__intro">
          Gõ từ khoá và bấm <strong>Tìm OPhim</strong> để gọi API tìm kiếm; hoặc chọn thể loại bên dưới
          cho danh sách demo.
        </p>
      )}

      <GenreChips genres={GENRES} active={genre} onChange={setGenre} />
      <div className="movie-grid">
        {filteredLocal.length === 0 ? (
          <p className="movie-empty">Không có phim demo khớp bộ lọc.</p>
        ) : (
          filteredLocal.map((m) => (
            <MovieCard key={m.id} id={`movie-${m.id}`} movie={m} variant="grid" />
          ))
        )}
      </div>

      {hasOphimQuery && (
        <p className="browse-footer-hint">
          Mẹo: từ thanh tìm trên trang chủ cũng mở URL này với <code className="browse-page__code">q</code> —{' '}
          <Link to="/">Về trang chủ</Link>
        </p>
      )}
    </div>
  )
}
