import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [react(), visualizer()],
  server: {
    host: '0.0.0.0',
    port: 9000,
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
    },
  },
});
