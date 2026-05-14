export function MoviePlayer({ src, poster, title }) {
  return (
    <div className="movie-player-card">
      <video
        key={src}
        className="movie-player"
        controls
        playsInline
        preload="metadata"
        poster={poster}
        aria-label={`Đang phát ${title}`}
      >
        <source src={src} type="video/mp4" />
        Trình duyệt không hỗ trợ phát video HTML5.
      </video>
      <p className="movie-player-hint">
        Đang phát: <strong>{title}</strong> — file demo (thay bằng stream/HLS khi production).
      </p>
    </div>
  )
}
