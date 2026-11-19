import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In dev, /api requests are forwarded to the Express server.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:3001' } },
})
