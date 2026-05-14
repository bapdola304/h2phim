/** Tiện ích map response OPhim → dùng trong UI */

export const OPHIM_HOME_URL = 'https://ophim1.com/v1/api/home'
export const OPHIM_API_ORIGIN = 'https://ophim1.com'

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
