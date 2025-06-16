import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { VitePWA } from 'vite-plugin-pwa';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      jpeg: { quality: 75 },
      png: { quality: 70 },
      webp: { quality: 75 },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,webp,png,jpg}'],
      },
    }),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          KAKAO_JS_KEY: process.env.VITE_KAKAO_JS_KEY,
        },
      },
    }),
  ],
  build: {
    outDir: 'dist',
    minify: 'terser',
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '^/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});