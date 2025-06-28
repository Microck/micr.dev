import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/microkeebs/', // This sets the base path for assets
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});