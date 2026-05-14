import { useEffect, useMemo, useState } from 'react'
import { mapOphimItemToMovie, ophimSearchUrl } from '../lib/ophim'

const fetchOptions = {
  method: 'GET',
  headers: { accept: 'application/json' },
}

export function useOphimSearch(keyword) {
  const kw = String(keyword ?? '').trim()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!kw) {
      setData(null)
      setLoading(false)
      setError(null)
      return undefined
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(ophimSearchUrl(kw), fetchOptions)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (cancelled) return
        if (json.status !== 'success' || !json.data) {
          throw new Error(json.message || 'Phản hồi API không hợp lệ')
        }
        setData(json.data)
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Lỗi tìm kiếm')
          setData(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [kw])

  const movies = useMemo(() => {
    if (!data?.items?.length) return []
    const cdn = data.APP_DOMAIN_CDN_IMAGE ?? 'https://img.ophim.live'
    return data.items.map((it) => mapOphimItemToMovie(it, cdn))
  }, [data])

  return {
    keyword: kw,
    movies,
    loading,
    error,
    titlePage: data?.titlePage,
    seo: data?.seoOnPage,
    total: data?.params?.pagination?.totalItems ?? movies.length,
  }
}
