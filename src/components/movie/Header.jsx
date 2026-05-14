import { useCallback, useEffect, useId, useState } from "react";
import { NavLink } from "react-router-dom";
import { InstallButton } from "../InstallButton";
import { HomeSearchBar } from "./HomeSearchBar";

const NAV_LINKS = [
  { to: "/", end: true, label: "Trang chủ" },
  { to: "/danh-sach/phim-chieu-rap", label: "Phim Chiếu Rạp" },
  { to: "/danh-sach/phim-le", label: "Phim Lẻ" },
  { to: "/danh-sach/phim-bo", label: "Phim Bộ" },
  { to: "/danh-sach/phim-moi", label: "Phim Mới" },
  { to: "/danh-sach/hoat-hinh", label: "Phim Hoạt Hình" },
  { to: "/danh-sach/tv-shows", label: "TV Shows" },
];

function StatusPill({ isOnline }) {
  return (
    <div
      className={`movie-status ${isOnline ? "movie-status--online" : "movie-status--offline"}`}
      aria-live="polite"
    >
      <span className="movie-status__dot" />
      {isOnline ? "Online" : "Offline"}
    </div>
  );
}

export function Header({ isOnline, canInstall, isInstalled, isIOSDevice, onInstall }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navPanelId = useId();

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen, closeMenu]);

  return (
    <header className={`movie-header${menuOpen ? " movie-header--menu-open" : ""}`}>
      <NavLink to="/" className="movie-header__brand" end onClick={closeMenu}>
        <span className="movie-header__mark" aria-hidden>
          ▶
        </span>
        <span className="movie-header__title">
          H2<span>Phim</span>
        </span>
      </NavLink>

      <button
        type="button"
        className="movie-header__menu-btn"
        aria-expanded={menuOpen}
        aria-controls={navPanelId}
        aria-label={menuOpen ? "Đóng menu điều hướng" : "Mở menu điều hướng"}
        onClick={toggleMenu}
      >
        <span className="movie-header__menu-bars" aria-hidden>
          <span />
          <span />
          <span />
        </span>
      </button>

      <button
        type="button"
        className="movie-header__backdrop"
        tabIndex={-1}
        aria-hidden="true"
        onClick={closeMenu}
      />

      <nav
        id={navPanelId}
        className="movie-header__nav"
        aria-label="Chính"
      >
        <div className="movie-header__nav-head">
          <span className="movie-header__nav-title">Menu</span>
          <button
            type="button"
            className="movie-header__nav-close"
            aria-label="Đóng menu"
            onClick={closeMenu}
          >
            ×
          </button>
        </div>
        {NAV_LINKS.map(({ to, end, label }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `movie-header__link${isActive ? " movie-header__link--active" : ""}`
            }
            onClick={closeMenu}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="home-search-strip">
        <HomeSearchBar layout="header" />
      </div>

      <div className="movie-header__actions">
        <StatusPill isOnline={isOnline} />
        <InstallButton
          canInstall={canInstall}
          isInstalled={isInstalled}
          isIOSDevice={isIOSDevice}
          onInstall={onInstall}
        />
      </div>
    </header>
  );
}
