import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api": {
        //target: "https://backend.eglo.pw",
        target: "http://localhost:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: true,
      },
      "/ackee": {
        target: "https://ackee.eglo.pw",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ackee/, ""),
        secure: true,
      },
      "/rts": {
        target: "http://100.115.14.60:41287",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rts/, ""),
        secure: true,
        ws: true,
      },
      "/fs": {
        target: "http://localhost:6969",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fs/, ""),
        secure: true,
        ws: true,
      },
    },
  },
});