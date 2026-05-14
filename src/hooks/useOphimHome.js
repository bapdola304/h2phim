import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  mapOphimItemToMovie,
  mapOphimItemsToSpotlights,
  OPHIM_HOME_URL,
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
