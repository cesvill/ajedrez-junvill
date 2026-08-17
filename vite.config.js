import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tunnelPlugin } from './vite-plugin-tunnel.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tunnelPlugin()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
    open: false
  }
})

