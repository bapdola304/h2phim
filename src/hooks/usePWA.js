import { useState, useEffect, useCallback } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

/**
 * usePWA — hook tổng hợp quản lý mọi thứ liên quan PWA:
 *   - installPrompt: hiện nút "Cài đặt app"
 *   - updateSW: thông báo khi có version mới
 *   - offlineReady: báo khi app đã sẵn sàng offline
 *   - isOnline: theo dõi trạng thái mạng
 *   - isInstalled: kiểm tra đã install chưa
 */
export function usePWA() {
  // ── Online / Offline status ─────────────────────────────────────
  const [isOnline, setIsOnline] = useState(navigator.onLine)

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
    // Kiểm tra đã chạy ở standalone mode (đã install) chưa
    const mq = window.matchMedia('(display-mode: standalone)')
    setIsInstalled(mq.matches)
    const handler = (e) => setIsInstalled(e.matches)
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
    // Install
    canInstall: !!installPrompt && !isInstalled,
    isInstalled,
    triggerInstall,
    // SW Update
    offlineReady,
    needRefresh,
    updateServiceWorker,
    dismissUpdate,
  }
}
