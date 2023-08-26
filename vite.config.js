import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://backend.eglo.pw",
        //target: "http://100.69.124.41:5000/",
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
    },
  },
});
