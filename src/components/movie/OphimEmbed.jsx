export function OphimEmbed({ src, title }) {
  if (!src) return null

  return (
    <div className="ophim-embed">
      <iframe
        key={src}
        title={title || 'Phát video'}
        src={src}
        className="ophim-embed__frame"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    </div>
  )
}
