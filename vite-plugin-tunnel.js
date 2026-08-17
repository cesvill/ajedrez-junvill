import { spawn } from 'child_process';
import os from 'os';
import fs from 'fs';
import path from 'path';

export function tunnelPlugin() {
  let tunnelProcess = null;
  let tunnelUrl = null;
  let tunnelStatus = 'idle'; // 'idle' | 'starting' | 'running' | 'error'

  const DB_DIR = path.join(process.cwd(), 'database');
  const DB_FILE = path.join(DB_DIR, 'users_db.json');

  // Asegurar que la carpeta database exista
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  } catch (e) {
    console.error('Error creating database directory', e);
  }

  const DB_BACKUP_FILE = path.join(DB_DIR, 'users_db_backup.json');

  const readDbUsers = () => {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error reading users database', e);
      try {
        if (fs.existsSync(DB_BACKUP_FILE)) {
          const raw = fs.readFileSync(DB_BACKUP_FILE, 'utf-8');
          return JSON.parse(raw);
        }
      } catch (errBackup) {
        console.error('Error reading backup users database', errBackup);
      }
    }
    return null;
  };

  const writeDbUsers = (usersData) => {
    try {
      if (!usersData || !Array.isArray(usersData) || usersData.length === 0) {
        return false;
      }
      if (fs.existsSync(DB_FILE)) {
        try {
          fs.copyFileSync(DB_FILE, DB_BACKUP_FILE);
        } catch (e) {}
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(usersData, null, 2), 'utf-8');
      return true;
    } catch (e) {
      console.error('Error writing users database', e);
      return false;
    }
  };

  const getLocalIp = () => {
    try {
      const interfaces = os.networkInterfaces();
      for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
          if (iface.family === 'IPv4' && !iface.internal) {
            return iface.address;
          }
        }
      }
    } catch (e) {
      console.error('Error getting local IP', e);
    }
    return 'localhost';
  };

  const startTunnel = () => {
    if (tunnelProcess && tunnelUrl) {
      return Promise.resolve(tunnelUrl);
    }

    tunnelStatus = 'starting';
    tunnelUrl = null;

    return new Promise((resolve) => {
      const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
      tunnelProcess = spawn(cmd, ['-y', 'cloudflared', 'tunnel', '--url', 'http://localhost:3000'], {
        shell: true
      });

      const urlRegex = /https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/;

      const handleData = (data) => {
        const text = data.toString();
        const match = text.match(urlRegex);
        if (match && !tunnelUrl) {
          tunnelUrl = match[0];
          tunnelStatus = 'running';
          console.log(`\n[TÚNEL CLOUDFLARE ONLINE ACTIVO]: ${tunnelUrl}\n`);
          resolve(tunnelUrl);
        }
      };

      tunnelProcess.stderr.on('data', handleData);
      tunnelProcess.stdout.on('data', handleData);

      tunnelProcess.on('error', (err) => {
        console.error('[Tunnel Error]:', err);
        tunnelStatus = 'error';
        tunnelProcess = null;
        resolve(null);
      });

      tunnelProcess.on('exit', () => {
        tunnelStatus = 'idle';
        tunnelUrl = null;
        tunnelProcess = null;
      });

      setTimeout(() => {
        if (!tunnelUrl) {
          resolve(null);
        }
      }, 30000);
    });
  };

  const stopTunnel = () => {
    if (tunnelProcess) {
      try {
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', String(tunnelProcess.pid), '/f', '/t']);
        } else {
          tunnelProcess.kill('SIGTERM');
        }
      } catch (e) {
        console.error('Error stopping tunnel process', e);
      }
      tunnelProcess = null;
    }
    tunnelUrl = null;
    tunnelStatus = 'idle';
  };

  return {
    name: 'vite-plugin-tunnel-and-db',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // --- 1. ENDPOINTS DE BASE DE DATOS LOCAL JSON ---
        if (req.url === '/api/db/users' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          const users = readDbUsers();
          res.end(JSON.stringify({
            success: true,
            hasData: !!users,
            users: users || null
          }));
          return;
        }

        if (req.url === '/api/db/users' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            res.setHeader('Content-Type', 'application/json');
            try {
              const data = JSON.parse(body);
              const currentUsers = readDbUsers() || [];
              const userMap = new Map(currentUsers.map(u => [u.id, u]));

              if (data.action === 'upsert' && data.user && data.user.id) {
                userMap.set(data.user.id, data.user);
                const updated = Array.from(userMap.values());
                writeDbUsers(updated);
                res.end(JSON.stringify({ success: true, count: updated.length, users: updated }));
                return;
              }

              if (data.action === 'delete' && data.userId) {
                userMap.delete(data.userId);
                const updated = Array.from(userMap.values());
                writeDbUsers(updated);
                res.end(JSON.stringify({ success: true, count: updated.length, users: updated }));
                return;
              }

              let incomingList = Array.isArray(data) ? data : (data.users || []);
              if (Array.isArray(incomingList) && incomingList.length > 0) {
                if (data.fullReplace === true) {
                  writeDbUsers(incomingList);
                  res.end(JSON.stringify({ success: true, count: incomingList.length, users: incomingList }));
                  return;
                }

                // Smart Merge: actualizar existentes y añadir nuevos sin borrar perfiles existentes creados por otros clientes
                incomingList.forEach(u => {
                  if (u && u.id) {
                    userMap.set(u.id, u);
                  }
                });

                const merged = Array.from(userMap.values());
                writeDbUsers(merged);
                res.end(JSON.stringify({ success: true, count: merged.length, users: merged }));
                return;
              }

              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'Invalid payload' }));
            } catch (e) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: e.message }));
            }
          });
          return;
        }

        // --- 2. ENDPOINTS DE CONTROL DE TÚNEL CLOUDFLARE ---
        if (req.url === '/api/tunnel/status') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            active: tunnelStatus === 'running' && !!tunnelUrl,
            status: tunnelStatus,
            url: tunnelUrl,
            localIp: getLocalIp(),
            localUrl: `http://${getLocalIp()}:3000/`
          }));
          return;
        }

        if (req.url === '/api/tunnel/start' && req.method === 'POST') {
          res.setHeader('Content-Type', 'application/json');
          try {
            const url = await startTunnel();
            res.end(JSON.stringify({
              success: !!url,
              url: url,
              status: tunnelStatus
            }));
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: e.message }));
          }
          return;
        }

        if (req.url === '/api/tunnel/stop' && req.method === 'POST') {
          res.setHeader('Content-Type', 'application/json');
          stopTunnel();
          res.end(JSON.stringify({ success: true, status: 'idle' }));
          return;
        }

        next();
      });
    }
  };
}
