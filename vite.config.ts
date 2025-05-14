import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import macrosPlugin from 'vite-plugin-babel-macros'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), macrosPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/auth': 'http://127.0.0.1:8080',
    }
  }
});
