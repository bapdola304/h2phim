import { useEffect, useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { MovieCard } from '../components/movie/MovieCard'
import { useOphimDanhSach } from '../hooks/useOphimHome'
import { OPHIM_DANH_SACH_SLUGS } from '../lib/ophim'

const PER_PAGE = 50

function parsePage(raw) {
  const n = parseInt(String(raw ?? '1'), 10)
  if (!Number.isFinite(n) || n < 1) return 1
  return n
}

/** Số trang + khoảng … khi danh sách dài */
function paginationPageItems(current, total) {
  if (total <= 12) {
    return Array.from({ length: total }, (_, i) => ({ type: 'page', n: i + 1 }))
  }
  const want = new Set([1, 2, total - 1, total, current, current - 1, current + 1])
  const sorted = [...want].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)
  const out = []
  for (let i = 0; i < sorted.length; i += 1) {
    const n = sorted[i]
    if (i > 0 && n - sorted[i - 1] > 1) out.push({ type: 'gap' })
    out.push({ type: 'page', n })
  }
  return out
}

export default function OphimDanhSachPage() {
  const { slug: slugParam } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const slug = String(slugParam ?? '').trim()
  const slugOk = OPHIM_DANH_SACH_SLUGS.includes(slug)

  const page = parsePage(searchParams.get('page'))

  const { movies, loading, error, titlePage, pagination, reload, seo } = useOphimDanhSach(
    slugOk ? slug : '',
    { limit: PER_PAGE, page, sort_type: 'desc' }
  )

  const totalPages = useMemo(() => {
    if (!pagination?.totalItems) return 1
    const per = pagination.totalItemsPerPage || PER_PAGE
    return Math.max(1, Math.ceil(pagination.totalItems / per))
  }, [pagination])

  useEffect(() => {
    if (!seo?.titleHead) return undefined
    const prev = document.title
    document.title = seo.titleHead
    return () => {
      document.title = prev
    }
  }, [seo])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page, slug])

  const setPage = (nextPage) => {
    const p = Math.min(Math.max(1, nextPage), totalPages)
    const next = new URLSearchParams(searchParams)
    if (p <= 1) next.delete('page')
    else next.set('page', String(p))
    setSearchParams(next, { replace: true })
  }

  const pageBase = `/danh-sach/${encodeURIComponent(slug)}`

  if (!slugOk) {
    return (
      <div className="movie-page-enter ophim-ds-page">
        <div className="home-api-banner home-api-banner--error" role="alert">
          <p>
            <strong>Danh sách không hợp lệ:</strong> <code className="browse-page__code">{slug || '—'}</code>
          </p>
          <p className="ophim-ds-page__hint">
            <Link to="/">Về trang chủ</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="movie-page-enter ophim-ds-page movie-section" style={{ marginTop: '1.5rem' }}>
      <div className="movie-section__head ophim-ds-page__head">
        <div>
          <h1 className="movie-section__title">{titlePage || slug}</h1>
          <p className="ophim-ds-page__meta">
            <Link to="/" className="ophim-ds-page__back">
              ← Trang chủ
            </Link>
            {pagination ? (
              <>
                {' · '}
                <span>
                  {pagination.totalItems.toLocaleString('vi-VN')} phim ·{' '}
                  {pagination.totalItemsPerPage || PER_PAGE} / trang
                </span>
              </>
            ) : null}
          </p>
        </div>
        <button type="button" className="home-api-retry" onClick={() => reload()}>
          Tải lại
        </button>
      </div>

      {loading && (
        <p className="home-api-status" role="status">
          Đang tải danh sách…
        </p>
      )}
      {error && (
        <div className="home-api-banner home-api-banner--error" role="alert">
          <p>
            <strong>OPhim:</strong> {error}
          </p>
        </div>
      )}

      {!loading && !error && movies.length === 0 && (
        <p className="movie-empty">Không có phim trên trang này.</p>
      )}

      {movies.length > 0 && (
        <div className="movie-grid browse-ophim-grid">
          {movies.map((m) => (
            <MovieCard key={m.slug || m.id} movie={m} variant="grid" />
          ))}
        </div>
      )}

      {slugOk && pagination && totalPages > 1 && (
        <nav className="ophim-ds-pagination" aria-label="Phân trang danh sách">
          <div className="ophim-ds-pagination__row">
            <button
              type="button"
              className="ophim-ds-pagination__btn"
              disabled={page <= 1 || loading}
              onClick={() => setPage(page - 1)}
            >
              ← Trước
            </button>
            <span className="ophim-ds-pagination__status">
              Trang <strong>{page}</strong> / {totalPages}
            </span>
            <button
              type="button"
              className="ophim-ds-pagination__btn"
              disabled={page >= totalPages || loading}
              onClick={() => setPage(page + 1)}
            >
              Sau →
            </button>
          </div>
          <ul className="ophim-ds-pagination__pages">
            {paginationPageItems(page, totalPages).map((item, i) =>
              item.type === 'gap' ? (
                <li key={`g-${i}`} className="ophim-ds-pagination__ellipsis" aria-hidden>
                  …
                </li>
              ) : (
                <li key={item.n}>
                  <Link
                    to={item.n <= 1 ? pageBase : `${pageBase}?page=${item.n}`}
                    className={`ophim-ds-pagination__page${item.n === page ? ' ophim-ds-pagination__page--active' : ''}`}
                    aria-current={item.n === page ? 'page' : undefined}
                  >
                    {item.n}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      )}
    </div>
  )
}
