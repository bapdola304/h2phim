import { useEffect, useMemo } from 'react'
import { Hero } from '../components/movie/Hero'
import { HomeGenreTiles } from '../components/movie/HomeGenreTiles'
import { HomeSpotlightRail } from '../components/movie/HomeSpotlightRail'
import { MovieRow } from '../components/movie/MovieRow'
import { useOphimHome, useOphimDanhSach } from '../hooks/useOphimHome'
import { HOME_GENRE_TILES, HOME_SPOTLIGHTS } from '../data/homeEditorial'
import { MOVIES } from '../data/movies'

export default function HomePage() {
  const {
    loading,
    error,
    reload,
    seo,
    rowTrending,
    rowMore,
    spotlights,
    movies,
    hasApiData,
  } = useOphimHome()

  const { movies: danhSachPhimChieuRap } = useOphimDanhSach('phim-chieu-rap')
  const { movies: danhSachPhimLe } = useOphimDanhSach('phim-le')
  const { movies: danhSachPhimMoi } = useOphimDanhSach('hoat-hinh')
  const { movies: danhSachPhimBo } = useOphimDanhSach('phim-bo')

  const staticTrending = MOVIES.filter((m) => !m.featured).slice(0, 6)
  const staticOriginals = [...MOVIES].reverse().slice(0, 5)

  const heroSlides = useMemo(() => {
    if (hasApiData && movies.length > 0) return movies.slice(0, 8)
    return MOVIES.slice(0, 6)
  }, [hasApiData, movies])

  const displayTrending = hasApiData ? rowTrending : staticTrending
  const displayMore = hasApiData ? (rowMore.length ? rowMore : rowTrending.slice(6, 12)) : staticOriginals
  const displaySpotlights = hasApiData && spotlights.length >= 3 ? spotlights : HOME_SPOTLIGHTS
  const spotlightSubtitle = hasApiData
    ? 'Lấy từ API trang chủ OPhim — mở tab mới khi bấm.'
    : undefined

  useEffect(() => {
    if (!seo?.titleHead) return undefined
    const prev = document.title
    document.title = seo.titleHead
    return () => {
      document.title = prev
    }
  }, [seo])

  return (
    <div className="home-page movie-page-enter">
      {loading && (
        <p className="home-api-status" role="status">
          Đang tải danh sách Phim…
        </p>
      )}
      {error && (
        <div className="home-api-banner home-api-banner--error" role="alert">
          <p>
            <strong>Không tải được API OPhim:</strong> {error}
          </p>
          <button type="button" className="home-api-retry" onClick={() => reload()}>
            Thử lại
          </button>
        </div>
      )}

      <div className="home-page__intro">
        <p className="home-page__kicker">Xin chào, H2Phim chúc bạn xem phim vui vẻ</p>
        <h2 className="home-page__lead">Khám phá phim theo cảm hứng của bạn</h2>
      </div>

      <Hero movies={heroSlides} variant="home" />

      {/* <HomeSpotlightRail items={displaySpotlights} subtitle={spotlightSubtitle} /> */}

      <MovieRow
        id="trending"
        title={hasApiData ? 'Phim Chiếu Rạp' : 'Đang thịnh hành'}
        movies={danhSachPhimChieuRap}
        slug="phim-chieu-rap"
      />
      <MovieRow
        id="trending"
        title={hasApiData ? 'Phim Lẻ' : 'Đang thịnh hành'}
        movies={danhSachPhimLe}
        slug="phim-le"
      />
      <MovieRow
        id="trending"
        title={hasApiData ? 'Phim Hoạt Hình' : 'Đang thịnh hành'}
        movies={danhSachPhimMoi}
        slug="hoat-hinh"
      />
      <MovieRow
        id="trending"
        title={hasApiData ? 'Phim Bộ' : 'Đang thịnh hành'}
        movies={danhSachPhimBo}
        slug="phim-bo"
      />
    </div>
  )
}
