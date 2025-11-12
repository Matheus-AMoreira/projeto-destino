import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "certs/localhost-key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "certs/localhost.pem")),
    },
    proxy: {
      "/api": {
        target: "https://localhost:8080/",
        secure: false,
        changeOrigin: true,
      },
    },
    host: "localhost",
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
