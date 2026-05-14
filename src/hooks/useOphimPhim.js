import { useCallback, useEffect, useState } from 'react'
import { ophimPhimDetailUrl } from '../lib/ophim'

const fetchOptions = {
  method: 'GET',
  headers: { accept: 'application/json' },
}

export function useOphimPhim(slug) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    const s = String(slug || '').trim()
    if (!s) {
      setLoading(false)
      setError('Thiếu slug phim')
      setData(null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(ophimPhimDetailUrl(s), fetchOptions)
      const json = await res.json()
      if (!res.ok || json.status !== 'success' || !json.data?.item) {
        throw new Error(json.message || 'Không tìm thấy phim')
      }
      setData(json.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi tải chi tiết')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, reload: load }
}
