import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Proxy api requests to the server for dev convenience
      '/api': 'http://localhost:4000'
    }
  }
});
