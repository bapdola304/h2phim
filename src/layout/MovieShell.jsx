import { Outlet, useLocation } from 'react-router-dom'
import { usePWA } from '../hooks/usePWA'
import { PWAToast } from '../components/PWAToast'
import { Header } from '../components/movie/Header'
import { HomeSearchBar } from '../components/movie/HomeSearchBar'
import { Footer } from '../components/movie/Footer'
import '../styles/movie.css'
import '../components/movie/movie-ui.css'

export default function MovieShell() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  const {
    isOnline,
    canInstall,
    isInstalled,
    triggerInstall,
    offlineReady,
    needRefresh,
    updateServiceWorker,
    dismissUpdate,
  } = usePWA()

  return (
    <div className="movie-app">
      {isHome ? (
        <div className="movie-shell-top">
          <Header
            isOnline={isOnline}
            canInstall={canInstall}
            isInstalled={isInstalled}
            onInstall={triggerInstall}
          />
        </div>
      ) : (
        <Header
          isOnline={isOnline}
          canInstall={canInstall}
          isInstalled={isInstalled}
          onInstall={triggerInstall}
        />
      )}
      <main className="movie-main">
        <Outlet />
      </main>
      <Footer />
      <PWAToast
        offlineReady={offlineReady}
        needRefresh={needRefresh}
        isOnline={isOnline}
        onUpdate={() => updateServiceWorker(true)}
        onDismiss={dismissUpdate}
      />
    </div>
  )
}
