/**
 * PWAToast — hiện thông báo khi:
 *   1. App sẵn sàng offline (offlineReady)
 *   2. Có version mới (needRefresh)
 *   3. Đang offline
 */
export function PWAToast({ offlineReady, needRefresh, isOnline, onUpdate, onDismiss }) {
  if (!offlineReady && !needRefresh && isOnline) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      alignItems: 'center',
      pointerEvents: 'none',
    }}>
      {/* Offline banner */}
      {!isOnline && (
        <Toast color="#ef4444" icon="📡">
          Bạn đang offline — app vẫn hoạt động từ cache
        </Toast>
      )}

      {/* Offline ready */}
      {offlineReady && (
        <Toast color="#10b981" icon="✅" onDismiss={onDismiss}>
          App đã sẵn sàng dùng offline!
        </Toast>
      )}

      {/* New version available */}
      {needRefresh && (
        <Toast color="#3b82f6" icon="🔄" onDismiss={onDismiss}>
          <span>Có phiên bản mới!</span>
          <button
            onClick={onUpdate}
            style={{
              marginLeft: '0.75rem',
              padding: '0.25rem 0.75rem',
              background: 'white',
              color: '#3b82f6',
              border: 'none',
              borderRadius: '999px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.8rem',
              pointerEvents: 'all',
            }}
          >
            Cập nhật ngay
          </button>
        </Toast>
      )}
    </div>
  )
}

function Toast({ children, color, icon, onDismiss }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.25rem',
      background: color,
      color: 'white',
      borderRadius: '999px',
      fontSize: '0.875rem',
      fontWeight: '500',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      pointerEvents: 'all',
      whiteSpace: 'nowrap',
      animation: 'slideUp 0.3s ease',
    }}>
      <span>{icon}</span>
      {children}
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            marginLeft: '0.5rem',
            background: 'rgba(255,255,255,0.25)',
            border: 'none',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            cursor: 'pointer',
            fontSize: '0.7rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >✕</button>
      )}
    </div>
  )
}
