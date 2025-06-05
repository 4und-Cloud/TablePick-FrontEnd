import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import macrosPlugin from 'vite-plugin-babel-macros'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), macrosPlugin()],
  esbuild: {
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    jsxInject: `import React from 'react'`
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '^/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
});
