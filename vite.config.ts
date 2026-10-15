/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["learn-fun-logo.jpg", "apple-touch-icon.png", "icon-192x192.png", "icon-512x512.png"],
      // Editorial URLs must receive their own HTML rather than the cached
      // homepage used as the interactive app's navigation fallback.
      workbox: {
        navigateFallbackDenylist: [/^\/(?:blog|features|guides)(?:\/|$)/, /^\/privacy\.html$/],
      },
      manifest: {
        name: "Learn Fun",
        short_name: "LearnFun",
        description: "An engaging educational app for children aged 1–5",
        theme_color: "#FFC800",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
