export function OphimEpisodePicker({ servers, serverIndex, episodeIndex, onPick }) {
  if (!servers?.length) return null

  const server = servers[serverIndex]
  const eps = server?.eps ?? []

  return (
    <div className="ophim-picker">
      {servers.length > 1 && (
        <div className="ophim-picker__servers" role="tablist" aria-label="Nguồn phát">
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
    </div>
  )
}
