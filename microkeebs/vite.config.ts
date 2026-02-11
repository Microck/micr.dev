// microkeebs/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";

export default defineConfig({
  base: "/microkeebs/",
  plugins: [
    react(),
    mdx({
      jsxImportSource: "react",
      providerImportSource: "@mdx-js/react",
    }),
  ],
  assetsInclude: ['**/*.glb'],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});