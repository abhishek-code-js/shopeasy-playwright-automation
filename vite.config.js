import { defineConfig } from "vite";

export default defineConfig({
  build: { outDir: "dist" },
  server: { port: 5173 },
  preview: { port: 4173 },
});
