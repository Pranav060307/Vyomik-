import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

function waitlistApiPlugin() {
  return {
    name: 'waitlist-api',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if ((url === '/api/v1/waitlist' || url === '/api/v1/preregister' || url === '/api/waitlist') && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              const email = (data.email || '').trim().toLowerCase();
              const source = data.source || 'coming_soon_gate';
              if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
                res.statusCode = 422;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ detail: 'Invalid email address' }));
                return;
              }

              // File paths to sync
              const rootTxt = path.resolve(__dirname, '../preregistrations.txt');
              const backendTxt = path.resolve(__dirname, '../backend/preregistrations.txt');
              const rootLog = path.resolve(__dirname, '../preregistrations_detailed.log');
              const backendLog = path.resolve(__dirname, '../backend/preregistrations_detailed.log');

              // Read existing emails
              const existingEmails = new Set<string>();
              [rootTxt, backendTxt].forEach((filePath) => {
                if (fs.existsSync(filePath)) {
                  try {
                    const content = fs.readFileSync(filePath, 'utf-8');
                    content.split('\n').forEach((line) => {
                      const trimmed = line.trim().toLowerCase();
                      if (trimmed && !trimmed.startsWith('#')) {
                        existingEmails.add(trimmed);
                      }
                    });
                  } catch (e) {
                    console.error('Error reading waitlist file:', e);
                  }
                }
              });

              if (existingEmails.has(email)) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    success: true,
                    email,
                    is_duplicate: true,
                    message: 'You are already on the VIP list. We will email you 1 hour before doors open.',
                    created_at: new Date().toISOString(),
                  })
                );
                return;
              }

              // Append new email to both txt files
              [rootTxt, backendTxt].forEach((filePath) => {
                try {
                  fs.mkdirSync(path.dirname(filePath), { recursive: true });
                  fs.appendFileSync(filePath, `${email}\n`, 'utf-8');
                } catch (e) {
                  console.error('Error appending to waitlist file:', e);
                }
              });

              // Detailed audit log
              const logEntry = `${new Date().toISOString()} | ${email} | source=${source}\n`;
              [rootLog, backendLog].forEach((logPath) => {
                try {
                  fs.mkdirSync(path.dirname(logPath), { recursive: true });
                  fs.appendFileSync(logPath, logEntry, 'utf-8');
                } catch {
                  // ignore
                }
              });

              res.statusCode = 201;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  email,
                  is_duplicate: false,
                  message: "You're on the list. We'll email you 1 hour before the first drop opens.",
                  created_at: new Date().toISOString(),
                })
              );
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ detail: err.message || 'Internal server error' }));
            }
          });
          return;
        }

        if ((url === '/api/v1/waitlist/emails' || url === '/api/v1/preregister/emails') && req.method === 'GET') {
          const rootTxt = path.resolve(__dirname, '../preregistrations.txt');
          const emails: string[] = [];
          if (fs.existsSync(rootTxt)) {
            const content = fs.readFileSync(rootTxt, 'utf-8');
            content.split('\n').forEach((line) => {
              const trimmed = line.trim().toLowerCase();
              if (trimmed && !trimmed.startsWith('#')) {
                emails.push(trimmed);
              }
            });
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(emails));
          return;
        }

        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), waitlistApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5180,
    strictPort: true,
    host: true,
  },
  // @ts-expect-error vitest config
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
