import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Force Vite to accept traffic from localtunnel
    port: 5173,
    strictPort: true,
    allowedHosts: ['.loca.lt']
  }
});