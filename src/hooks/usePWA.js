import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

/** iPhone / iPod / iPad (kể cả iPadOS giả MacIntel). Chrome trên iOS vẫn là iOS — không có beforeinstallprompt. */
function getIsIOSDevice() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  if (/iPad|iPhone|iPod/i.test(ua)) return true
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return true
  return false
}

function getIsStandalone() {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false
  const mq = window.matchMedia('(display-mode: standalone)')
  if (mq.matches) return true
  // Safari iOS: mở từ icon màn hình chính
  return navigator.standalone === true
}

/**
 * usePWA — hook tổng hợp quản lý mọi thứ liên quan PWA:
 *   - installPrompt: hiện nút "Cài đặt app"
 *   - updateSW: thông báo khi có version mới
 *   - offlineReady: báo khi app đã sẵn sàng offline
 *   - isOnline: theo dõi trạng thái mạng
 *   - isInstalled: kiểm tra đã install chưa
 */
export function usePWA() {
  const isIOSDevice = useMemo(() => getIsIOSDevice(), [])

  // ── Online / Offline status ─────────────────────────────────────
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

  useEffect(() => {
    const handleOnline  = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online',  handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online',  handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // ── Install Prompt (A2HS — Add to Home Screen) ──────────────────
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isInstalled,   setIsInstalled]   = useState(false)

  useEffect(() => {
    // Đã cài (standalone / icon màn hình chính trên iOS)
    const mq = window.matchMedia('(display-mode: standalone)')
    const syncInstalled = () => setIsInstalled(getIsStandalone())
    syncInstalled()
    const handler = () => syncInstalled()
    mq.addEventListener('change', handler)

    // Bắt sự kiện beforeinstallprompt để lưu lại
    const handleInstallPrompt = (e) => {
      e.preventDefault()          // ngăn browser tự hiện prompt
      setInstallPrompt(e)         // lưu lại để dùng sau
    }
    window.addEventListener('beforeinstallprompt', handleInstallPrompt)

    // Khi user install xong
    const handleInstalled = () => {
      setInstallPrompt(null)
      setIsInstalled(true)
    }
    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      mq.removeEventListener('change', handler)
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  // Gọi hàm này khi user bấm nút "Cài đặt"
  const triggerInstall = useCallback(async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstallPrompt(null)
    }
  }, [installPrompt])

  // ── Service Worker Update (vite-plugin-pwa) ─────────────────────
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh:  [needRefresh,  setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('[PWA] Service Worker registered:', r)
      // Kiểm tra update mỗi 60 giây
      if (r) {
        setInterval(() => r.update(), 60 * 1000)
      }
    },
    onRegisterError(error) {
      console.error('[PWA] Service Worker registration error:', error)
    },
    onOfflineReady() {
      console.log('[PWA] App ready for offline use')
    },
    onNeedRefresh() {
      console.log('[PWA] New content available')
    },
  })

  const dismissUpdate = useCallback(() => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }, [setOfflineReady, setNeedRefresh])

  return {
    // Network
    isOnline,
    // Install — canInstall chỉ true khi có beforeinstallprompt (Chromium), không có trên iOS
    canInstall: !!installPrompt && !isInstalled,
    isIOSDevice,
    isInstalled,
    triggerInstall,
    // SW Update
    offlineReady,
    needRefresh,
    updateServiceWorker,
    dismissUpdate,
  }
}
