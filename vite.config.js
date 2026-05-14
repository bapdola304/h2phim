import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // ============================================================
      // 1. REGISTER TYPE
      // 'autoUpdate'   → SW tự cập nhật ngầm (không hỏi user)
      // 'prompt'       → Hiện prompt hỏi user có muốn update không
      // ============================================================
      registerType: 'prompt',

      // ============================================================
      // 2. DEV OPTIONS — bật SW khi chạy `npm run dev`
      // ============================================================
      devOptions: {
        enabled: true,
        type: 'module',
      },

      // ============================================================
      // 3. INCLUDE ASSETS — các file trong /public cần đưa vào cache
      // ============================================================
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'mask-icon.svg',
        'pwa-192x192.png',
        'pwa-512x512.png',
      ],

      // ============================================================
      // 4. WEB APP MANIFEST
      // ============================================================
      manifest: {
        name: 'H2Phim',
        short_name: 'H2Phim',
        description: 'H2Phim - Xem phim online miễn phí',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',          // ẩn thanh địa chỉ trình duyệt
        display_override: ['window-controls-overlay', 'standalone'],
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        categories: ['productivity', 'utilities'],
        lang: 'vi',
        dir: 'ltr',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',             // icon thường
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',        // icon bo góc Android
          },
        ],
        // Shortcuts — xuất hiện khi long-press icon trên mobile
        shortcuts: [
          {
            name: 'Trang chủ',
            short_name: 'Home',
            description: 'Về trang chủ',
            url: '/',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }],
          },
        ],
        // Screenshots — hiện trong install dialog trên Chrome
        screenshots: [
          {
            src: 'screenshot-wide.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Desktop view',
          },
          {
            src: 'screenshot-narrow.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Mobile view',
          },
        ],
      },

      // ============================================================
      // 5. WORKBOX — cấu hình Service Worker & caching strategy
      // ============================================================
      workbox: {
        // Precache tất cả assets được build ra
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],

        // Runtime caching — cache theo từng loại request
        runtimeCaching: [
          // Cache Google Fonts
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 năm
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Cache API calls (ví dụ JSONPlaceholder)
          {
            urlPattern: /^https:\/\/jsonplaceholder\.typicode\.com\/.*/i,
            handler: 'NetworkFirst',    // ưu tiên network, fallback cache
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 ngày
              },
              cacheableResponse: { statuses: [0, 200] },
              networkTimeoutSeconds: 5,  // timeout sau 5s thì dùng cache
            },
          },
          {
            urlPattern: /^https:\/\/ophim1\.com\/v1\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'ophim-api-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 30 },
              cacheableResponse: { statuses: [0, 200] },
              networkTimeoutSeconds: 8,
            },
          },
          {
            urlPattern: /^https:\/\/img\.ophim\.(live|cc)\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'ophim-images-cache',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Cache images từ bên ngoài
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 ngày
              },
            },
          },
        ],

        // Bỏ qua các URL không cần cache
        navigateFallbackDenylist: [/^\/api\//],

        // Cleanup cache cũ khi SW mới activate
        cleanupOutdatedCaches: true,

        // Skip waiting — SW mới activate ngay lập tức
        skipWaiting: false, // false vì dùng 'prompt' registerType
        clientsClaim: true,
      },
    }),
  ],
})
