import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'disabled', // מבטל את רישום ה-Service Worker
      workbox: false,           // מבטל את כל הפונקציות הקשורות ל-workbox
      injectRegister: 'null',    // מונע רישום אוטומטי
      manifest: {
        name: 'השם של האפליקציה שלך',
        short_name: 'שם קצר',
        description: 'תיאור האפליקציה שלך',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
