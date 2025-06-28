import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // This is the crucial line that tells Vite your app will live in a subfolder.
  // It ensures all asset paths (CSS, JS, images) are generated correctly.
  base: "/microkeebs/",

  // This is your project-specific dependency optimization. Keep it.
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});