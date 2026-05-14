import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MovieShell from './layout/MovieShell'
import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import MovieDetailPage from './pages/MovieDetailPage'
import OphimMoviePage from './pages/OphimMoviePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MovieShell />}>
          <Route index element={<HomePage />} />
          <Route path="browse" element={<BrowsePage />} />
          <Route path="movie/:id" element={<MovieDetailPage />} />
          <Route path="phim/:slug" element={<OphimMoviePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
