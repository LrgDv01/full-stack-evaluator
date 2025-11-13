// To test direct CORS : Temporarily disable the proxy (comment out the proxy config) below.
import { defineConfig } from 'vite' 
import react from '@vitejs/plugin-react' 

// https://vite.dev/config/
// Vite proxy setup to forward API requests to the backend server
export default defineConfig({
  // Plugins: React for JSX/refresh support in dev
  plugins: [react()], 
  server: {
    proxy: {
      '/api': { 
        // Target: Backend URL (matches .env VITE_API_BASE_URL); assumes local dev—update for prod
        target: 'http://localhost:5215',  // Backend server URL
        // ChangeOrigin: Spoofs request origin to bypass CORS in dev
        changeOrigin: true,
        // Rewrite: Preserves /api prefix for clean routing (handles API quirks like path inconsistencies)
        rewrite: (path) => path.replace(/^\/api/, '/api') // Keep the /api prefix
      }
    }
  }
})
