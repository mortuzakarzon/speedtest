import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// We proxy /api requests to the backend (port 4000) during dev
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
