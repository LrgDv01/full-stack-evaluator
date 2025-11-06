// To test direct CORS : Temporarily disable the proxy (comment out the proxy config) below.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5215',  // Backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')  // Optional: strip /api
      }
    }
  }
})
