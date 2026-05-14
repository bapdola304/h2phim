# ⚡ React + Vite PWA — Project Mẫu Hoàn Chỉnh

Project mẫu đầy đủ cấu hình PWA production-ready với React và Vite.

## 🚀 Bắt đầu nhanh

```bash
# 1. Cài dependencies
npm install

# 2. Chạy dev (có bật Service Worker)
npm run dev

# 3. Build production
npm run build

# 4. Preview build (để test PWA đầy đủ)
npm run preview
```

## 📁 Cấu trúc Project

```
├── public/
│   ├── favicon.ico              # Favicon 32x32
│   ├── apple-touch-icon.png     # iOS icon 180x180
│   ├── mask-icon.svg            # Safari Pinned Tab (monochrome)
│   ├── pwa-192x192.png          # PWA icon bắt buộc
│   ├── pwa-512x512.png          # PWA icon bắt buộc
│   └── robots.txt               # Cho phép search engines crawl
│
├── src/
│   ├── hooks/
│   │   └── usePWA.js            # Hook: install prompt + SW update + online status
│   ├── components/
│   │   ├── PWAToast.jsx         # Thông báo offline/update
│   │   └── InstallButton.jsx    # Nút cài đặt app (A2HS)
│   ├── App.jsx                  # App chính với 3 tab demo
│   └── main.jsx                 # Entry point
│
├── index.html                   # Meta tags PWA đầy đủ
├── vite.config.js               # Cấu hình VitePWA + Workbox
└── package.json
```

## ⚙️ Cấu hình chi tiết

### `vite.config.js` — Điểm quan trọng nhất

```js
VitePWA({
  registerType: 'prompt',      // hoặc 'autoUpdate'
  workbox: {
    runtimeCaching: [...]      // Caching strategies
  }
})
```

### Caching Strategies (Workbox)

| Strategy | Dùng cho | Hoạt động |
|---|---|---|
| `CacheFirst` | Images, fonts | Dùng cache trước, ít request mạng |
| `NetworkFirst` | API calls | Dùng network trước, fallback cache khi offline |
| `StaleWhileRevalidate` | JS/CSS | Dùng cache ngay, cập nhật ngầm |

### `registerType`

| Giá trị | Hành vi |
|---|---|
| `'autoUpdate'` | SW tự update ngầm, user không biết |
| `'prompt'` | Hiện thông báo hỏi user có muốn update |

## 🧪 Test PWA

### Cách 1: Lighthouse
```bash
npm run build && npm run preview
```
Mở `http://localhost:4173` → Chrome DevTools → Lighthouse → Progressive Web App → Analyze

### Cách 2: Test offline
1. Mở DevTools → Application → Service Workers
2. Check "Offline" → Reload trang
3. App vẫn chạy được ✅

### Cách 3: Install
- Chrome/Edge: Có icon ⊕ trên thanh địa chỉ
- Mobile: "Add to Home Screen" trong menu trình duyệt

## 🔧 Tùy chỉnh Icons

Dùng một trong các tool sau để tạo icons từ logo của bạn:
- **[PWA Assets Generator](https://vite-pwa-org.netlify.app/assets-generator/)** — CLI, khuyên dùng
- **[Favicon InBrowser.App](https://favicon.inbrowser.app/tools/favicon-generator)** — Online tool
- **[RealFaviconGenerator](https://realfavicongenerator.net/)** — Classic tool

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.8",
    "vite-plugin-pwa": "^0.20.5",
    "workbox-window": "^7.1.0"
  }
}
```

## ✅ PWA Checklist

- [x] `index.html` có đầy đủ meta tags (viewport, theme-color, apple-touch-icon…)
- [x] Web App Manifest với name, short_name, description, theme_color
- [x] Icon 192×192 và 512×512
- [x] `robots.txt` cho phép crawl
- [x] Service Worker với Workbox
- [x] Caching strategies (CacheFirst, NetworkFirst)
- [x] Offline support
- [x] Install prompt (A2HS)
- [x] Update notification
- [x] Online/offline status detection
- [ ] HTTPS (cần khi deploy production)

## 🚀 Deploy

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload thư mục dist/ lên Netlify
```

### Lưu ý: Server phải serve `manifest.webmanifest` với MIME type đúng
```
application/manifest+json
```
