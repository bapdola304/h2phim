/**
 * Khối editorial trang chủ — ảnh Unsplash (giấy phép Unsplash).
 * Tham chiếu layout landing phim community (ví dụ node 4-4).
 */

const U = (id, w, h) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=85`

export const HOME_SPOTLIGHTS = [
  {
    id: 'sp-hot',
    badge: 'Đang hot',
    title: 'Phòng chiếu tại nhà',
    caption: 'Chọn phim và xem ngay trên mọi thiết bị.',
    image: U('photo-1489599849927-2ee91cede3ba', 960, 540),
    to: '/browse',
  },
  {
    id: 'sp-pick',
    badge: 'Biên tập viên chọn',
    title: 'Khoa học viễn tưởng đáng xem',
    caption: 'Những tựa gợi ý cho tối cuối tuần.',
    image: U('photo-1451187580459-43490279c0fa', 960, 540),
    to: `/browse?genre=${encodeURIComponent('Khoa học viễn tưởng')}`,
  },
  {
    id: 'sp-new',
    badge: 'Mới cập nhật',
    title: 'Danh sách mở rộng',
    caption: 'Khám phá thể loại và lọc nhanh.',
    image: U('photo-1536440136628-849c177e76a1', 960, 540),
    to: '/browse',
  },
]

/** Thẻ thể loại trên trang chủ (bỏ “Tất cả”) — ảnh minh hoạ từng mood */
export const HOME_GENRE_TILES = [
  {
    genre: 'Hành động',
    image: U('photo-1440404653325-ab12749d9b1a', 800, 600),
  },
  {
    genre: 'Khoa học viễn tưởng',
    image: U('photo-1614732414444-096e569f615c', 800, 600),
  },
  {
    genre: 'Tâm lý',
    image: U('photo-1478720568477-152d9b164e26', 800, 600),
  },
  {
    genre: 'Hài',
    image: U('photo-1517604931442-7e0c8ed2963c', 800, 600),
  },
  {
    genre: 'Kinh dị',
    image: U('photo-1509248961158-e54f6934749c', 800, 600),
  },
  {
    genre: 'Hoạt hình',
    image: U('photo-1618005182384-a83a8bd57fbe', 800, 600),
  },
]
