import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    proxy: {
      // Proxy /api/* → FastAPI backend on :8000
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      // Proxy /health → FastAPI backend on :8000
      '/health': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    }
  }
})

