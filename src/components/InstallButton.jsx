/**
 * InstallButton — nút "Cài đặt App"
 * Chỉ hiện khi trình duyệt hỗ trợ A2HS và app chưa được cài
 */
export function InstallButton({ canInstall, isInstalled, onInstall }) {
  if (isInstalled) {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.5rem 1rem',
        background: 'rgba(16, 185, 129, 0.15)',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        borderRadius: '999px',
        color: '#10b981',
        fontSize: '0.85rem',
        fontWeight: '500',
      }}>
        ✓ Đã cài đặt
      </div>
    )
  }

  if (!canInstall) {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.5rem 1rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '999px',
        color: 'rgba(255,255,255,0.4)',
        fontSize: '0.85rem',
        cursor: 'default',
      }}>
        📱 Mở trên Chrome/Edge để cài đặt
      </div>
    )
  }

  return (
    <button
      onClick={onInstall}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.6rem 1.25rem',
        background: 'linear-gradient(135deg, #facc15, #f59e0b)',
        border: 'none',
        borderRadius: '999px',
        color: '#0f172a',
        fontSize: '0.9rem',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(250,204,21,0.4)',
        transition: 'transform 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={e => {
        e.target.style.transform = 'translateY(-2px)'
        e.target.style.boxShadow = '0 6px 24px rgba(250,204,21,0.5)'
      }}
      onMouseLeave={e => {
        e.target.style.transform = 'translateY(0)'
        e.target.style.boxShadow = '0 4px 20px rgba(250,204,21,0.4)'
      }}
    >
      ⬇️ Cài đặt App
    </button>
  )
}
