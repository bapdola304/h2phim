import { NavLink } from "react-router-dom";
import { InstallButton } from "../InstallButton";
import { HomeSearchBar } from "./HomeSearchBar";

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

export function Header({ isOnline, canInstall, isInstalled, onInstall }) {
  return (
    <header className="movie-header">
      <NavLink to="/" className="movie-header__brand" end>
        <span className="movie-header__mark" aria-hidden>
          ▶
        </span>
        <span className="movie-header__title">
          H2<span>Phim</span>
        </span>
      </NavLink>

      <nav className="movie-header__nav" aria-label="Chính">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `movie-header__link${isActive ? " movie-header__link--active" : ""}`
          }
        >
          Trang chủ
        </NavLink>
        <NavLink
          to="/browse"
          className={({ isActive }) =>
            `movie-header__link${isActive ? " movie-header__link--active" : ""}`
          }
        >
          Khám phá
        </NavLink>
      </nav>

      <div className="home-search-strip">
        <HomeSearchBar layout="header" />
      </div>

      <div className="movie-header__actions">
        <StatusPill isOnline={isOnline} />
        <InstallButton
          canInstall={canInstall}
          isInstalled={isInstalled}
          onInstall={onInstall}
        />
      </div>
    </header>
  );
}
