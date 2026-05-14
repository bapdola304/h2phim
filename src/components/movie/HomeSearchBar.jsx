import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function HomeSearchBar({ layout = 'default' }) {
  const [value, setValue] = useState('')
  const navigate = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()
    const q = value.trim()
    if (q) navigate(`/browse?q=${encodeURIComponent(q)}`)
    else navigate('/browse')
  }

  const cls = [
    'home-search',
    layout === 'hero' ? 'home-search--hero' : '',
    layout === 'header' ? 'home-search--header' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <form className={cls} onSubmit={onSubmit} role="search" aria-label="Tìm phim">
      <div className="home-search__inner">
        <span className="home-search__icon" aria-hidden>
          ⌕
        </span>
        <input
          className="home-search__input"
          type="search"
          name="q"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Tìm phim trên OPhim (từ khóa)…"
          autoComplete="off"
          enterKeyHint="search"
        />
        <button type="submit" className="home-search__btn">
          Tìm kiếm
        </button>
      </div>
    </form>
  )
}
