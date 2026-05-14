import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  mapOphimItemToMovie,
  OPHIM_THE_LOAI_INDEX_URL,
  ophimTheLoaiMoviesUrl,
} from '../lib/ophim'

const fetchOptions = {
  method: 'GET',
  headers: { accept: 'application/json' },
}

/** Danh sách thể loại từ `GET /v1/api/the-loai`. */
export function useOphimTheLoaiList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(OPHIM_THE_LOAI_INDEX_URL, fetchOptions)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      if (json.status !== 'success' || !Array.isArray(json.data?.items)) {
        throw new Error(json.message || 'Phản hồi API thể loại không hợp lệ')
      }
      setItems(json.data.items)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi tải thể loại OPhim')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { genres: items, loading, error, reload: load }
}

/**
 * Phim theo một thể loại: `GET /v1/api/the-loai/[slug]`.
 * @param {string} slug — ví dụ `hanh-dong`; rỗng thì không gọi API
 */
export function useOphimTheLoaiMovies(slug, options = {}) {
  const sort_type = options.sort_type ?? 'desc'
  const limit = options.limit ?? 24
  const page = options.page ?? 1
  const sort_field = options.sort_field

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
      const url = ophimTheLoaiMoviesUrl(slugTrim, {
        sort_type,
        limit,
        page,
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
      setError(e instanceof Error ? e.message : 'Lỗi tải phim theo thể loại')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [slugTrim, sort_type, limit, page, sort_field])

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
    pagination,
    hasApiData: movies.length > 0,
  }
}
