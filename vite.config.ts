import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      jpeg: { quality: 75 }, // 품질 더 낮춰 크기 감소
      png: { quality: 70 },
      webp: { quality: 75 },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,webp,png,jpg}'],
      },
    }),



    ],
  build: {
    outDir: 'dist',
    minify: 'terser',
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true, // 콘솔 제거
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // 모든 node_modules를 vendor로
          }
        },
      },
    },
  },
  esbuild: {
    drop: ['console', 'debugger'], // build와 중복, 제거 가능
    // jsx 설정은 plugin-react가 처리하므로 생략 권장
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
