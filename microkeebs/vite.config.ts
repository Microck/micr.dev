// microkeebs/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // This is mandatory. It tells the app to look for assets at /microkeebs/assets/...
  base: "/microkeebs/",
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});