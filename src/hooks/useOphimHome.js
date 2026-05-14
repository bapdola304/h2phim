import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  mapOphimItemToMovie,
  mapOphimItemsToSpotlights,
  OPHIM_HOME_URL,
  ophimDanhSachUrl,
} from '../lib/ophim'

const fetchOptions = {
  method: 'GET',
  headers: { accept: 'application/json' },
}

export function useOphimHome() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(OPHIM_HOME_URL, fetchOptions)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      if (json.status !== 'success' || !json.data) {
        throw new Error(json.message || 'Phản hồi API không hợp lệ')
      }
      setData(json.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi tải dữ liệu OPhim')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const cdn = data?.APP_DOMAIN_CDN_IMAGE ?? 'https://img.ophim.live'
  const items = data?.items ?? []

  const movies = useMemo(() => items.map((it) => mapOphimItemToMovie(it, cdn)), [items, cdn])

  const heroMovie = movies[0] ?? null
  const rowTrending = useMemo(() => movies.slice(0, 12), [movies])
  const rowMore = useMemo(() => movies.slice(12, 24), [movies])
  const spotlights = useMemo(() => mapOphimItemsToSpotlights(items, cdn, 3), [items, cdn])
  const seo = data?.seoOnPage ?? null

  return {
    loading,
    error,
    reload: load,
    seo,
    heroMovie,
    rowTrending,
    rowMore,
    spotlights,
    movies,
    hasApiData: movies.length > 0,
  }
}

/**
 * Danh sách phim theo tab OPhim (`/v1/api/danh-sach/[slug]`).
 *
 * @param {string} slug — `phim-le` | `phim-bo` | `phim-chieu-rap` | `phim-moi` | … (xem `OPHIM_DANH_SACH_SLUGS` trong `lib/ophim.js`)
 * @param {{ limit?: number, sort_type?: 'desc'|'asc', page?: number, sort_field?: string, country?: string, category?: string }} [options]
 *        - `sort_type`: `desc` = mới cập nhật trước (mặc định), `asc` = cũ trước
 *        - `limit`: số phim mỗi trang (do bạn truyền, mặc định 24)
 *        - `page`: trang (mặc định 1)
 *        - `country`, `category`: slug lọc (query `country`, `category` trên `/danh-sach/[slug]`)
 */
export function useOphimDanhSach(slug, options = {}) {
  const sort_type = options.sort_type ?? 'desc'
  const limit = options.limit ?? 24
  const page = options.page ?? 1
  const sort_field = options.sort_field
  const country = options.country ?? ''
  const category = options.category ?? ''

  const slugTrim = String(slug ?? '').trim()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!slugTrim) {
      setData(null)
      setError(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const url = ophimDanhSachUrl(slugTrim, {
        sort_type,
        limit,
        page,
        country,
        category,
        ...(sort_field ? { sort_field } : {}),
      })
      const res = await fetch(url, fetchOptions)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      if (json.status !== 'success' || !json.data) {
        throw new Error(json.message || 'Phản hồi API không hợp lệ')
      }
      setData(json.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi tải danh sách OPhim')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [slugTrim, sort_type, limit, page, sort_field, country, category])

  useEffect(() => {
    load()
  }, [load])

  const movies = useMemo(() => {
    if (!data?.items?.length) return []
    const cdn = data.APP_DOMAIN_CDN_IMAGE ?? 'https://img.ophim.live'
    return data.items.map((it) => mapOphimItemToMovie(it, cdn))
  }, [data])

  const pagination = data?.params?.pagination ?? null

  return {
    slug: slugTrim,
    loading,
    error,
    reload: load,
    movies,
    titlePage: data?.titlePage,
    seo: data?.seoOnPage,
    breadCrumb: data?.breadCrumb,
    pagination,
    params: data?.params ?? null,
    hasApiData: movies.length > 0,
  }
}
