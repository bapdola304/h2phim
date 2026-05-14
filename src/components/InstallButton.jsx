const iosHintStyle = {
  maxWidth: 'min(100%, 16rem)',
  padding: '0.5rem 0.75rem',
  background: 'rgba(59, 130, 246, 0.12)',
  border: '1px solid rgba(59, 130, 246, 0.35)',
  borderRadius: '12px',
  color: 'rgba(226, 232, 240, 0.95)',
  fontSize: '0.8rem',
  lineHeight: 1.45,
}

/**
 * InstallButton — cài PWA
 * - Android / Chrome desktop: dùng beforeinstallprompt (nút vàng).
 * - iPhone / iPad: Apple không cho prompt lập trình; chỉ hướng dẫn Thêm vào Màn hình chính.
 */
export function InstallButton({ canInstall, isInstalled, isIOSDevice = false, onInstall }) {
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

  if (isIOSDevice) {
    return (
      <details style={iosHintStyle}>
        <summary
          style={{
            cursor: 'pointer',
            fontWeight: 600,
            listStyle: 'none',
          }}
        >
          📱 Cài trên iPhone / iPad
        </summary>
        <ol
          style={{
            margin: '0.6rem 0 0',
            paddingLeft: '1.1rem',
            color: 'rgba(226, 232, 240, 0.85)',
            fontSize: '0.78rem',
          }}
        >
          <li style={{ marginBottom: '0.35rem' }}>
            <strong>Safari:</strong> bấm nút <strong>Chia sẻ</strong> (ô có mũi tên) →{' '}
            <strong>Thêm vào Màn hình chính</strong> → Thêm.
          </li>
          <li>
            <strong>Chrome trên iPhone:</strong> menu <strong>⋮</strong> →{' '}
            <strong>Chia sẻ</strong> → <strong>Thêm vào Màn hình chính</strong>.
          </li>
        </ol>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.72rem', color: 'rgba(148, 163, 184, 0.95)' }}>
          iOS không cho website bấm một nút là cài như Android — đây là giới hạn của Apple, không phải lỗi app.
        </p>
      </details>
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
        📱 Mở Chrome / Edge (Android hoặc máy tính) để cài một chạm
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
