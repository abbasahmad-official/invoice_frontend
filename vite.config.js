import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Default for Vite, but good to make it explicit
  },
  server: {
    historyApiFallback: true, // For local dev
  },
});
