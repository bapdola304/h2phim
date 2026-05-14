import { Link } from 'react-router-dom'

function SpotlightCard({ item }) {
  const inner = (
    <>
      <div
        className="home-spotlight__media"
        style={{ backgroundImage: `url(${item.image})` }}
      />
      <div className="home-spotlight__shade" />
      <div className="home-spotlight__body">
        <span className="home-spotlight__badge">{item.badge}</span>
        <h3 className="home-spotlight__card-title">{item.title}</h3>
        <p className="home-spotlight__caption">{item.caption}</p>
      </div>
    </>
  )

  const ext = /^https?:\/\//i.test(item.to)
  if (ext) {
    return (
      <a
        href={item.to}
        className="home-spotlight__card"
        role="listitem"
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    )
  }

  return (
    <Link to={item.to} className="home-spotlight__card" role="listitem">
      {inner}
    </Link>
  )
}

export function HomeSpotlightRail({ items, subtitle }) {
  if (!items?.length) return null

  return (
    <section className="home-spotlight" aria-labelledby="home-spotlight-title">
      <div className="home-spotlight__head">
        <h2 id="home-spotlight-title" className="home-spotlight__title">
          Gợi ý cho bạn
        </h2>
        <p className="home-spotlight__sub">
          {subtitle ||
            'Bộ sưu tập được chọn lọc — ảnh minh hoạ từ Unsplash.'}
        </p>
      </div>
      <div className="home-spotlight__row" role="list">
        {items.map((item) => (
          <SpotlightCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
