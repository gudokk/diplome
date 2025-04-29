import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/back": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/back/, ""),
      },
    },
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    port: 5173
  }
})
