/// <reference lib="webworker" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "prompt",
      devOptions: {
        enabled: true,
        type: "module",
      },
      manifest: { background_color: "#000000", theme_color: "#000000" },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              return url.hostname === "ytmdl-music-server.vercel.app" && url.pathname.includes("/api/thumbnail");
            },
            handler: "CacheFirst",
            options: {
              cacheName: "thumbnail",
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30 * 12, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          {
            urlPattern: ({ url }) => {
              return url.hostname === "ytmdl-music-server.vercel.app" && url.pathname.includes("/api/music");
            },
            handler: "CacheFirst",
            options: {
              cacheName: "music",
              fetchOptions: {
                headers: [["Range", ""]], // range 요청 무시 -> partial content 요청시 캐싱이 제대로 안되는 버그 있음
              },

              // rangeRequests 옵션 제거
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30 * 12, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200], // 206 제외
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
