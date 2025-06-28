// microkeebs/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // NO 'base' property here!
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});