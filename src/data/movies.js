/** Mock dữ liệu phim — thay bằng API khi tích hập backend */

/** Video demo (Google sample bucket) — thay URL CDN thật khi production */
const V = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample'

export const GENRES = ['Tất cả', 'Hành động', 'Khoa học viễn tưởng', 'Tâm lý', 'Hài', 'Kinh dị', 'Hoạt hình']

const DEFAULT_CAST = [
  { name: 'Alex Rivera', role: 'Đạo diễn' },
  { name: 'Jordan Lee', role: 'Diễn viên' },
  { name: 'Sam Nova', role: 'Diễn viên' },
]

export const MOVIES = [
  {
    id: '1',
    title: 'Nebula Drift',
    year: 2025,
    rating: 8.6,
    duration: '2h 14m',
    genre: 'Khoa học viễn tưởng',
    synopsis:
      'Một phi hành gia mắc kẹt giữa các thiên hà song song phải tìm đường về nhà trước khi cổng không gian đóng vĩnh viễn.',
    poster:
      'https://images.unsplash.com/photo-1614732414444-096e569f615c?auto=format&fit=crop&w=640&h=960&q=85',
    backdrop:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&h=1080&q=85',
    videoUrl: `${V}/BigBuckBunny.mp4`,
    cast: DEFAULT_CAST,
    featured: true,
  },
  {
    id: '2',
    title: 'Midnight Alley',
    year: 2024,
    rating: 7.9,
    duration: '1h 58m',
    genre: 'Tâm lý',
    synopsis: 'Thám tử điều tra một loạt vụ mất tích quanh con hẻm không tồn tại trên bản đồ.',
    poster:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=640&h=960&q=85',
    backdrop:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1920&h=1080&q=85',
    videoUrl: `${V}/ElephantsDream.mp4`,
    cast: DEFAULT_CAST,
  },
  {
    id: '3',
    title: 'Iron Tide',
    year: 2025,
    rating: 8.1,
    duration: '2h 06m',
    genre: 'Hành động',
    synopsis: 'Biệt đội cứu hộ trên biển đối đầu với tổ chức buôn lậu vũ khí hạt nhân.',
    poster:
      'https://images.unsplash.com/photo-1596727147705-54a9d6d60f8f?auto=format&fit=crop&w=640&h=960&q=85',
    backdrop:
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1920&h=1080&q=85',
    videoUrl: `${V}/ForBiggerBlazes.mp4`,
    cast: DEFAULT_CAST,
  },
  {
    id: '4',
    title: 'Laugh Track',
    year: 2023,
    rating: 7.4,
    duration: '1h 42m',
    genre: 'Hài',
    synopsis: 'Diễn viên hài đột nhiên nghe thấy tiếng cười khán giả chỉ mình anh ta mới nghe được.',
    poster:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=640&h=960&q=85',
    backdrop:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&h=1080&q=85',
    videoUrl: `${V}/ForBiggerEscapes.mp4`,
    cast: DEFAULT_CAST,
  },
  {
    id: '5',
    title: 'Crimson Hollow',
    year: 2024,
    rating: 6.8,
    duration: '1h 52m',
    genre: 'Kinh dị',
    synopsis: 'Nhóm bạn trẻ cắm trại gần hang động bị ám bởi thực thể không có bóng.',
    poster:
      'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=640&h=960&q=85',
    backdrop:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&h=1080&q=85',
    videoUrl: `${V}/ForBiggerFun.mp4`,
    cast: DEFAULT_CAST,
  },
  {
    id: '6',
    title: 'Paper Wings',
    year: 2025,
    rating: 8.3,
    duration: '1h 36m',
    genre: 'Hoạt hình',
    synopsis: 'Cô bé vẽ những cánh chim giấy biến thành thật và dẫn cô bay qua thành phố mơ.',
    poster:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=640&h=960&q=85',
    backdrop:
      'https://images.unsplash.com/photo-1574267432553-e62325a63799?auto=format&fit=crop&w=1920&h=1080&q=85',
    videoUrl: `${V}/ForBiggerJoyrides.mp4`,
    cast: DEFAULT_CAST,
  },
  {
    id: '7',
    title: 'Vector Run',
    year: 2024,
    rating: 7.7,
    duration: '2h 01m',
    genre: 'Khoa học viễn tưởng',
    synopsis: 'Tài xế đua trong mô phỏng ảo phát hiện đường đua là bản sao của thế giới thật.',
    poster:
      'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=640&h=960&q=85',
    backdrop:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1920&h=1080&q=85',
    videoUrl: `${V}/ForBiggerMeltdowns.mp4`,
    cast: DEFAULT_CAST,
  },
  {
    id: '8',
    title: 'Silent Harbor',
    year: 2023,
    rating: 8.0,
    duration: '2h 22m',
    genre: 'Tâm lý',
    synopsis: 'Người mẹ mất con tìm lại tiếng nói qua băng ghi âm từ bến cảng bỏ hoang.',
    poster:
      'https://images.unsplash.com/photo-1470116945706-e6bf5d5a53ca?auto=format&fit=crop&w=640&h=960&q=85',
    backdrop:
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1920&h=1080&q=85',
    videoUrl: `${V}/Sintel.mp4`,
    cast: DEFAULT_CAST,
  },
]

export function getFeaturedMovie() {
  return MOVIES.find((m) => m.featured) ?? MOVIES[0]
}

export function getMoviesByGenre(genre) {
  if (!genre || genre === 'Tất cả') return MOVIES
  return MOVIES.filter((m) => m.genre === genre)
}

/** Lọc theo từ khoá (tiêu đề, thể loại, mô tả) — dùng trang Khám phá */
export function filterMoviesByQuery(movies, q) {
  const s = String(q ?? '')
    .trim()
    .toLowerCase()
  if (!s) return movies
  return movies.filter(
    (m) =>
      m.title.toLowerCase().includes(s) ||
      m.genre.toLowerCase().includes(s) ||
      m.synopsis.toLowerCase().includes(s),
  )
}

export function getMovieById(id) {
  return MOVIES.find((m) => m.id === String(id)) ?? null
}

/** Gợi ý: ưu tiên cùng thể loại, sau đó phim khác */
export function getRelatedMovies(movie, limit = 8) {
  if (!movie) return []
  const others = MOVIES.filter((m) => m.id !== movie.id)
  const sameGenre = others.filter((m) => m.genre === movie.genre)
  const diffGenre = others.filter((m) => m.genre !== movie.genre)
  return [...sameGenre, ...diffGenre].slice(0, limit)
}
