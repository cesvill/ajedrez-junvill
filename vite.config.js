import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tunnelPlugin } from './vite-plugin-tunnel.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tunnelPlugin()],
  build: {
    target: ['es2018', 'chrome70', 'firefox68', 'safari12']
  },
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
    open: false
  }
})

