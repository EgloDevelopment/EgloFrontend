import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:40002/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: true
      },
    }
  }
})
