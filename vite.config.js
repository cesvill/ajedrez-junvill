import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tunnelPlugin } from './vite-plugin-tunnel.js'

function apiSyncPlugin() {
  return {
    name: 'api-sync-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/sync')) return next();
        const { default: handler } = await import('./api/sync.js');
        const url = new URL(req.url, `http://${req.headers.host}`);
        req.query = Object.fromEntries(url.searchParams);
        
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          if (body) {
            try { req.body = JSON.parse(body); } catch (e) { req.body = {}; }
          }
          res.status = (code) => { res.statusCode = code; return res; };
          res.json = (data) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return res;
          };
          try {
            await handler(req, res);
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tunnelPlugin(), apiSyncPlugin()],
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

