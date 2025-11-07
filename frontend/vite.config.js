import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      injectRegister: "auto",

      manifest: {
        name: "Navi",
        short_name: "Navi",
        description: "AI-Powered Chat Application",
        theme_color: "#181818",
        background_color: "#0a1223",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "icons/Navi_icon-48x48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "icons/Navi_icon-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "icons/Navi_icon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "icons/Navi_icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "icons/Navi_icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "icons/Navi_icon-152x152.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "icons/Navi_icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/Navi_icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "icons/Navi_icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "icons/Navi_icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: "*",
            handler: "CacheFirst",
          },
        ],
      },
      registerType: "autoUpdate",
    }),
  ],
});
