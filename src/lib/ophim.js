/** Tiện ích map response OPhim → dùng trong UI */

export const OPHIM_HOME_URL = 'https://ophim1.com/v1/api/home'
export const OPHIM_API_ORIGIN = 'https://ophim1.com'

/** Danh mục quốc gia: `GET /v1/api/quoc-gia` → `data.items[]` với `name`, `slug`, `_id`. */
export const OPHIM_QUOC_GIA_INDEX_URL = `${OPHIM_API_ORIGIN}/v1/api/quoc-gia`

/** Danh mục thể loại: `GET /v1/api/the-loai` → `data.items[]` với `name`, `slug`, `_id`. */
export const OPHIM_THE_LOAI_INDEX_URL = `${OPHIM_API_ORIGIN}/v1/api/the-loai`

/**
 * Phim theo quốc gia: `GET /v1/api/quoc-gia/[slug]`.
 * @param {{ sort_type?: 'desc'|'asc', limit?: number, page?: number, sort_field?: string }} [query]
 */
export function ophimQuocGiaMoviesUrl(slug, query = {}) {
  const s = String(slug || '').trim()
  const qs = new URLSearchParams()
  if (query.sort_type) qs.set('sort_type', query.sort_type)
  if (query.limit != null && query.limit !== '') qs.set('limit', String(query.limit))
  if (query.page != null && query.page !== '') qs.set('page', String(query.page))
  if (query.sort_field) qs.set('sort_field', query.sort_field)
  const q = qs.toString()
  return `${OPHIM_API_ORIGIN}/v1/api/quoc-gia/${encodeURIComponent(s)}${q ? `?${q}` : ''}`
}

/**
 * Phim theo thể loại: `GET /v1/api/the-loai/[slug]`.
 * @param {{ sort_type?: 'desc'|'asc', limit?: number, page?: number, sort_field?: string }} [query]
 */
export function ophimTheLoaiMoviesUrl(slug, query = {}) {
  const s = String(slug || '').trim()
  const qs = new URLSearchParams()
  if (query.sort_type) qs.set('sort_type', query.sort_type)
  if (query.limit != null && query.limit !== '') qs.set('limit', String(query.limit))
  if (query.page != null && query.page !== '') qs.set('page', String(query.page))
  if (query.sort_field) qs.set('sort_field', query.sort_field)
  const q = qs.toString()
  return `${OPHIM_API_ORIGIN}/v1/api/the-loai/${encodeURIComponent(s)}${q ? `?${q}` : ''}`
}

export function ophimPhimDetailUrl(slug) {
  const s = String(slug || '').trim()
  return `${OPHIM_API_ORIGIN}/v1/api/phim/${encodeURIComponent(s)}`
}

/** Tìm kiếm phim theo từ khóa (OPhim). */
export function ophimSearchUrl(keyword) {
  const k = String(keyword || '').trim()
  const qs = new URLSearchParams({ keyword: k })
  return `${OPHIM_API_ORIGIN}/v1/api/tim-kiem?${qs.toString()}`
}

/**
 * Slug danh sách OPhim (`GET /v1/api/danh-sach/[slug]`).
 * Gồm phim lẻ, phim bộ, chiếu rạp, hoạt hình, …
 */
export const OPHIM_DANH_SACH_SLUGS = Object.freeze([
  'phim-moi',
  'phim-bo',
  'phim-le',
  'tv-shows',
  'hoat-hinh',
  'phim-vietsub',
  'phim-thuyet-minh',
  'phim-long-tien',
  'phim-bo-dang-chieu',
  'phim-bo-hoan-thanh',
  'phim-sap-chieu',
  'subteam',
  'phim-chieu-rap',
])

/**
 * URL danh sách theo thể loại / tab OPhim.
 * @param {string} slug — ví dụ `phim-le`, `phim-bo`, `phim-chieu-rap`
 * @param {{ sort_type?: 'desc'|'asc', limit?: number, page?: number, sort_field?: string, country?: string, category?: string }} [query]
 *        - `country`, `category`: slug quốc gia / thể loại (query OPhim `country`, `category`)
 */
export function ophimDanhSachUrl(slug, query = {}) {
  const s = String(slug || '').trim()
  const qs = new URLSearchParams()
  if (query.sort_type) qs.set('sort_type', query.sort_type)
  if (query.limit != null && query.limit !== '') qs.set('limit', String(query.limit))
  if (query.page != null && query.page !== '') qs.set('page', String(query.page))
  if (query.sort_field) qs.set('sort_field', query.sort_field)
  const country = String(query.country ?? '').trim()
  const category = String(query.category ?? '').trim()
  if (country) qs.set('country', country)
  if (category) qs.set('category', category)
  const q = qs.toString()
  return `${OPHIM_API_ORIGIN}/v1/api/danh-sach/${encodeURIComponent(s)}${q ? `?${q}` : ''}`
}

/**
 * Ghép URL ảnh: `APP_DOMAIN_CDN_IMAGE` thường chỉ là host; `thumb_url` / `poster_url` là file trong `/uploads/movies/`.
 */
export function ophimImageUrl(cdnBase, filePath) {
  if (!filePath) return ''
  const f = String(filePath).trim()
  if (!f) return ''
  if (/^https?:\/\//i.test(f)) return f
  const base = String(cdnBase || 'https://img.ophim.live').replace(/\/$/, '')
  const rel = f.startsWith('/') ? f : `/uploads/movies/${f}`
  return `${base}${rel}`
}

function formatRating(item) {
  const v = item?.imdb?.vote_average ?? item?.tmdb?.vote_average
  if (typeof v === 'number' && !Number.isNaN(v)) return v.toFixed(1)
  return '—'
}

function buildSynopsis(item) {
  const bits = [
    item.episode_current,
    item.quality && item.lang ? `${item.quality} · ${item.lang}` : item.quality || item.lang,
    item.origin_name && item.origin_name !== item.name ? item.origin_name : null,
  ].filter(Boolean)
  return bits.join(' — ') || 'Phim từ OPhim Vietsub.'
}

export function ophimWatchUrl(frontendBase, slug) {
  const base = String(frontendBase || 'https://ophim1.com').replace(/\/$/, '')
  return `${base}/phim/${encodeURIComponent(slug)}`
}

export function mapOphimItemToMovie(item, cdn) {
  const thumb = ophimImageUrl(cdn, item.thumb_url)
  const poster = item.poster_url ? ophimImageUrl(cdn, item.poster_url) : thumb
  const slug = item.slug || item._id
  const genreNames = Array.isArray(item.category) ? item.category.map((c) => c.name).filter(Boolean) : []

  return {
    id: item._id || slug,
    slug,
    title: item.name || 'Không tên',
    year: item.year ?? '—',
    rating: formatRating(item),
    duration: item.time || item.episode_current || '—',
    genre: genreNames.slice(0, 3).join(' · ') || '—',
    synopsis: buildSynopsis(item),
    poster,
    backdrop: poster,
    raw: item,
  }
}

export function mapOphimItemsToSpotlights(items, cdn, max = 3) {
  const list = (items || []).slice(0, max)
  return list.map((item, i) => {
    const img = ophimImageUrl(cdn, item.thumb_url)
    const slug = item.slug || item._id
    const ep = item.episode_current || ''
    const badge = ep.includes('Hoàn') ? 'Hoàn tất' : ['Mới', 'Hot', 'Đang chiếu'][i % 3]
    return {
      id: `spot-${item._id || i}`,
      badge,
      title: item.name || 'Phim',
      caption: [item.year, item.quality, item.lang].filter(Boolean).join(' · ') || 'OPhim',
      image: img,
      to: `/phim/${encodeURIComponent(slug)}`,
    }
  })
}

/** Chuẩn hoá danh sách server / tập từ `item.episodes` */
export function normalizeOphimServers(item) {
  const raw = item?.episodes
  if (!Array.isArray(raw)) return []
  return raw
    .map((s) => ({
      name: s.server_name || 'Server',
      eps: Array.isArray(s.server_data) ? s.server_data : [],
    }))
    .filter((s) => s.eps.length > 0)
}

/**
 * Các nguồn phát trong **cùng một tập** (đổi Opstream / backup / chất lượng…).
 * - Mặc định: dùng `link_embed` / `link_m3u8` của tập.
 * - Nếu tập có `server_data` là mảng object có link, và **không** phải danh sách tập OPhim (mỗi dòng có slug + name),
 *   thì coi đó là nhiều server trong tập → trả về từng nút chọn.
 */
export function getEpisodePlaybackSources(ep) {
  if (!ep) return []
  const defEmbed = typeof ep.link_embed === 'string' ? ep.link_embed : ''
  const defM3u8 = typeof ep.link_m3u8 === 'string' ? ep.link_m3u8 : ''
  const fallbackOne = () => {
    if (!defEmbed && !defM3u8) return []
    return [{ key: 'default', label: 'Mặc định', link_embed: defEmbed, link_m3u8: defM3u8 }]
  }

  const nested = ep.server_data
  if (!Array.isArray(nested) || nested.length === 0) return fallbackOne()

  const rows = nested.filter((x) => x && (x.link_embed || x.link_m3u8))
  if (!rows.length) return fallbackOne()

  const likeOphimEpisodeRow = (r) =>
    r.slug != null &&
    String(r.slug).length > 0 &&
    r.name != null &&
    String(r.name).length > 0

  if (rows.every(likeOphimEpisodeRow)) return fallbackOne()

  return rows.map((r, i) => ({
    key: `${r.server_name || r.name || 'src'}-${i}`,
    label: String(r.server_name || r.name || `Server ${i + 1}`),
    link_embed: typeof r.link_embed === 'string' ? r.link_embed : '',
    link_m3u8: typeof r.link_m3u8 === 'string' ? r.link_m3u8 : '',
  }))
}
