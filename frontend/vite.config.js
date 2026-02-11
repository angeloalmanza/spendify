import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": { target: "http://backend:8000", changeOrigin: true },
      "/sanctum": { target: "http://backend:8000", changeOrigin: true },
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) {
              return "vendor";
            }
            if (id.includes("lucide-react")) {
              return "icons";
            }
          }
        },
      },
    },
  },
  preview: {
    port: 3000,
    open: true,
  },
});
