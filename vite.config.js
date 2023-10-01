import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [sveltekit()],

  server: {
    fs: {
      strict: false,
    },
  },

  resolve: {
    alias: {
      "@functions": path.resolve(__dirname, "functions"),
    },
  },

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
      "/ens": {
        target: "http://100.115.14.60:2309/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ens/, ""),
        secure: true,
      },
    },
  },
});
