// Servidor local sin dependencias:  npm start   →  http://localhost:5173
// Solo escucha en 127.0.0.1 y no permite salir de la carpeta del proyecto.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT) || 5173;
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
};
const headers = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Cache-Control': 'no-store',
};
const hidden = /(^|[\/])(\.|node_modules|scripts|\.github)/; // no servir archivos ocultos ni internos

http.createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(root, p);
    if (!file.startsWith(root + path.sep) || hidden.test(path.relative(root, file))) throw Object.assign(new Error('forbidden'), { code: 403 });
    const data = await readFile(file);
    res.writeHead(200, { ...headers, 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch (e) {
    const code = e.code === 403 ? 403 : 404;
    const page = code === 404 ? await readFile(path.join(root, '404.html')).catch(() => 'Not found') : 'Forbidden';
    res.writeHead(code, { ...headers, 'Content-Type': 'text/html; charset=utf-8' });
    res.end(page);
  }
}).listen(port, '127.0.0.1', () => console.log(`9's → http://localhost:${port}`));
