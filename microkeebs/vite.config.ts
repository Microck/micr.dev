// microkeebs/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // This MUST be set to the subfolder path.
  base: "/microkeebs/",
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});