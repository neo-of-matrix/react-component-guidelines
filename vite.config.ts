import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), visualizer()],
  server: {
    port: 9000,
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@requests': '/src/requests',
    },
  },
});
