export function OphimEpisodePicker({
  servers,
  serverIndex,
  episodeIndex,
  onPick,
  playSources = [],
  mirrorIndex = 0,
  onMirrorPick,
}) {
  if (!servers?.length) return null

  const server = servers[serverIndex]
  const eps = server?.eps ?? []
  const showMirrors = typeof onMirrorPick === 'function' && playSources.length > 1

  return (
    <div className="ophim-picker">
      {servers.length > 0 && (
        <div className="ophim-picker__servers" role="tablist" aria-label="Nguồn phát (Vietsub, lồng tiếng, …)">
          {servers.map((s, si) => (
            <button
              key={s.name + si}
              type="button"
              role="tab"
              aria-selected={si === serverIndex}
              className={`ophim-picker__server${si === serverIndex ? ' ophim-picker__server--active' : ''}`}
              onClick={() => onPick(si, 0)}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
      <div className="ophim-picker__eps" role="list" aria-label="Danh sách tập">
        {eps.map((ep, ei) => (
          <button
            key={`${ep.slug}-${ei}`}
            type="button"
            role="listitem"
            className={`ophim-picker__ep${ei === episodeIndex ? ' ophim-picker__ep--active' : ''}`}
            onClick={() => onPick(serverIndex, ei)}
          >
            {ep.name || `Tập ${ei + 1}`}
          </button>
        ))}
      </div>
      {showMirrors && (
        <>
          <h4 className="ophim-picker-section-title ophim-picker-section-title--mirrors">
            Server trong tập
          </h4>
          <div className="ophim-picker__mirrors" role="tablist" aria-label="Server trong tập">
            {playSources.map((src, mi) => (
              <button
                key={src.key}
                type="button"
                role="tab"
                aria-selected={mi === mirrorIndex}
                className={`ophim-picker__server ophim-picker__mirror${mi === mirrorIndex ? ' ophim-picker__server--active' : ''}`}
                onClick={() => onMirrorPick(mi)}
              >
                {src.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
