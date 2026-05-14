import { useCallback, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BrowseOphimSelect } from "../components/browse/BrowseOphimSelect";
import { MovieCard } from "../components/movie/MovieCard";
import { useOphimCountryList } from "../hooks/useOphimQuocGia";
import { useOphimTheLoaiList } from "../hooks/useOphimTheLoai";
import { useOphimSearch } from "../hooks/useOphimSearch";
import { useOphimDanhSach } from "../hooks/useOphimHome";

const BROWSE_PATH = "/browse";
const PER_PAGE = 20;

function parsePage(raw) {
  const n = parseInt(String(raw ?? "1"), 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return n;
}

/** Số trang + khoảng … khi danh sách dài (giống OphimDanhSachPage). */
function paginationPageItems(current, total) {
  if (total <= 12) {
    return Array.from({ length: total }, (_, i) => ({ type: "page", n: i + 1 }));
  }
  const want = new Set([1, 2, total - 1, total, current, current - 1, current + 1]);
  const sorted = [...want].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < sorted.length; i += 1) {
    const n = sorted[i];
    if (i > 0 && n - sorted[i - 1] > 1) out.push({ type: "gap" });
    out.push({ type: "page", n });
  }
  return out;
}

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const qUrl = searchParams.get("q") ?? "";
  const qTrim = qUrl.trim();
  const countrySlug = (searchParams.get("country") ?? "").trim();
  const genreSlug = (searchParams.get("genre") ?? "").trim();
  const page = parsePage(searchParams.get("page"));

  const {
    countries,
    loading: countriesLoading,
    error: countriesError,
  } = useOphimCountryList();
  const {
    genres,
    loading: genresLoading,
    error: genresError,
  } = useOphimTheLoaiList();

  const hasCountry = Boolean(countrySlug);
  const hasGenre = Boolean(genreSlug);
  const hasBrowseFilter = hasCountry || hasGenre;

  /** Danh sách nền để lọc theo `country` / `category` (API bắt buộc có [slug] trong path). */
  const browseMovies = useOphimDanhSach(hasBrowseFilter ? "phim-moi" : "", {
    country: countrySlug,
    category: genreSlug,
    limit: PER_PAGE,
    page,
    sort_type: "desc",
  });
  const ophim = useOphimSearch(qTrim);

  const totalPages = useMemo(() => {
    const p = browseMovies.pagination;
    if (!p?.totalItems) return 1;
    const per = p.totalItemsPerPage || PER_PAGE;
    return Math.max(1, Math.ceil(p.totalItems / per));
  }, [browseMovies.pagination]);

  const browseLinkForPage = useCallback(
    (pageNum) => {
      const next = new URLSearchParams(searchParams);
      if (pageNum <= 1) next.delete("page");
      else next.set("page", String(pageNum));
      const qs = next.toString();
      return qs ? `${BROWSE_PATH}?${qs}` : BROWSE_PATH;
    },
    [searchParams],
  );

  const setCountryParam = useCallback(
    (slug) => {
      const next = new URLSearchParams(searchParams);
      const s = String(slug ?? "").trim();
      if (!s) next.delete("country");
      else next.set("country", s);
      next.delete("page");
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const setGenreParam = useCallback(
    (slug) => {
      const next = new URLSearchParams(searchParams);
      const s = String(slug ?? "").trim();
      if (!s) next.delete("genre");
      else next.set("genre", s);
      next.delete("page");
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const setBrowsePage = useCallback(
    (nextPage) => {
      const p = Math.min(Math.max(1, nextPage), totalPages);
      const next = new URLSearchParams(searchParams);
      if (p <= 1) next.delete("page");
      else next.set("page", String(p));
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams, totalPages],
  );

  useEffect(() => {
    if (!hasBrowseFilter) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, countrySlug, genreSlug, hasBrowseFilter]);

  const hasQuery = Boolean(qTrim);

  return (
    <div
      className="movie-page-enter movie-section"
      style={{ marginTop: "1.5rem" }}
    >
      <div className="browse-country-bar">
        <BrowseOphimSelect
          label="Thể loại"
          labelId="browse-genre-label"
          inputId="browse-genre-select"
          instanceId="browse-genre"
          items={genres}
          valueSlug={genreSlug}
          onChange={setGenreParam}
          disabled={genresLoading}
          placeholder="Gõ để tìm hoặc chọn thể loại…"
          noOptionsMessage="Không thấy thể loại"
        />
        <BrowseOphimSelect
          label="Quốc gia"
          labelId="browse-country-label"
          inputId="browse-country-select"
          instanceId="browse-country"
          items={countries}
          valueSlug={countrySlug}
          onChange={setCountryParam}
          disabled={countriesLoading}
          placeholder="Gõ để tìm hoặc chọn quốc gia…"
          noOptionsMessage="Không thấy quốc gia"
        />
        {(countriesLoading || genresLoading) && (
          <span className="browse-country__status" role="status">
            {countriesLoading && genresLoading
              ? "Đang tải quốc gia và thể loại…"
              : countriesLoading
                ? "Đang tải danh sách quốc gia…"
                : "Đang tải danh sách thể loại…"}
          </span>
        )}
        {countriesError && (
          <span className="browse-country__error" role="alert">
            Quốc gia: {countriesError}
          </span>
        )}
        {genresError && (
          <span className="browse-country__error" role="alert">
            Thể loại: {genresError}
          </span>
        )}
      </div>

      {hasBrowseFilter && (
        <section
          className="browse-country-section"
          aria-labelledby="browse-filter-movies-title"
        >
          <h2
            id="browse-filter-movies-title"
            className="browse-subsection-title"
          >
            {browseMovies.titlePage
              ? `${browseMovies.titlePage}`
              : "Phim đã lọc"}
          </h2>
          {browseMovies.loading && (
            <p className="home-api-status" role="status">
              Đang tải danh sách phim…
            </p>
          )}
          {browseMovies.error && (
            <div
              className="home-api-banner home-api-banner--error"
              role="alert"
            >
              <p>
                <strong>OPhim:</strong> {browseMovies.error}
              </p>
            </div>
          )}
          {!browseMovies.loading &&
            !browseMovies.error &&
            browseMovies.movies.length === 0 && (
              <p className="movie-empty">
                Không có phim khớp bộ lọc (quốc gia / thể loại) đã chọn.
              </p>
            )}
          {browseMovies.movies.length > 0 && (
            <div className="movie-grid browse-ophim-grid">
              {browseMovies.movies.map((m) => (
                <MovieCard key={m.slug || m.id} movie={m} variant="grid" />
              ))}
            </div>
          )}

          {browseMovies.pagination && totalPages > 1 && (
            <nav className="ophim-ds-pagination" aria-label="Phân trang kết quả lọc">
              <div className="ophim-ds-pagination__row">
                <button
                  type="button"
                  className="ophim-ds-pagination__btn"
                  disabled={page <= 1 || browseMovies.loading}
                  onClick={() => setBrowsePage(page - 1)}
                >
                  ← Trước
                </button>
                <span className="ophim-ds-pagination__status">
                  Trang <strong>{page}</strong> / {totalPages}
                </span>
                <button
                  type="button"
                  className="ophim-ds-pagination__btn"
                  disabled={page >= totalPages || browseMovies.loading}
                  onClick={() => setBrowsePage(page + 1)}
                >
                  Sau →
                </button>
              </div>
              <ul className="ophim-ds-pagination__pages">
                {paginationPageItems(page, totalPages).map((item, i) =>
                  item.type === "gap" ? (
                    <li
                      key={`g-${i}`}
                      className="ophim-ds-pagination__ellipsis"
                      aria-hidden
                    >
                      …
                    </li>
                  ) : (
                    <li key={item.n}>
                      <Link
                        to={browseLinkForPage(item.n)}
                        className={`ophim-ds-pagination__page${item.n === page ? " ophim-ds-pagination__page--active" : ""}`}
                        aria-current={item.n === page ? "page" : undefined}
                      >
                        {item.n}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>
          )}
        </section>
      )}

      {hasQuery && (!hasCountry && !hasGenre) && (
        <>
          <div className="browse-search-meta">
            <p className="movie-browse__intro browse-search-meta__text">
              Kết quả tìm kiếm : <strong>{qTrim}</strong>
              {ophim.titlePage ? ` — ${ophim.titlePage}` : ""}
            </p>
          </div>
          {ophim.loading && (
            <p className="home-api-status" role="status">
              Đang tìm trên OPhim…
            </p>
          )}
          {ophim.error && (
            <div
              className="home-api-banner home-api-banner--error"
              role="alert"
            >
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
        </>
      )}

      {!hasQuery && !hasCountry && !hasGenre && (
        <p className="movie-browse__intro browse-page-hint">
          Chọn <strong>quốc gia</strong> hoặc <strong>thể loại</strong> ở
          dropdown phía trên, hoặc mở tìm kiếm từ thanh tìm trên header (tham số{" "}
          <code className="browse-page__code">q</code>).
        </p>
      )}
    </div>
  );
}
