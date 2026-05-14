export function Footer() {
  return (
    <footer className="movie-footer">
      <p>© {new Date().getFullYear()} CineLab — layout tham chiếu community movie UI.</p>
      <div className="movie-footer__links">
        <a href="https://www.figma.com/design/Wv6szjMrXzM1oUs1t0TnTu/MOVIE-WEBSITE-UI-DESIGN--Community-?node-id=4-4">
          Figma (landing)
        </a>
        <a href="https://www.figma.com/design/Wv6szjMrXzM1oUs1t0TnTu/MOVIE-WEBSITE-UI-DESIGN--Community-?node-id=36-460">
          Figma (watch)
        </a>
        <span>PWA demo</span>
      </div>
    </footer>
  )
}
