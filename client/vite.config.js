import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 5000,
    fs: {
      allow: [__dirname, path.resolve(__dirname, "../server"), path.resolve(__dirname, "../shared")],
      deny: ["**/.env*", "**/.git/**"],
    },
    proxy: {
      '/api': {
        target: 'http://10.11.16.250:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
}));


