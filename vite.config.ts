import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";

export default defineConfig(({ mode }) => {
  const keyPath = path.resolve(__dirname, "certs/localhost-key.pem");
  const certPath = path.resolve(__dirname, "certs/localhost.pem");

  const isDevWithCerts =
    mode === "development" && fs.existsSync(keyPath) && fs.existsSync(certPath);

  return {
    plugins: [react(), tailwindcss()],
    server: {
      https: isDevWithCerts
        ? {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath),
          }
        : undefined,

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
  };
});
