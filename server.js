import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { existsSync } from 'fs';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const DIST_DIR = join(__dirname, 'dist');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain',
};

const server = createServer(async (req, res) => {
  try {
    const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(reqUrl.pathname);

    // Redirect legacy /sistechwork paths to clean root paths
    if (pathname === '/sistechwork' || pathname === '/sistechwork/' || pathname === '/sistechwork/index.html') {
      res.writeHead(301, { Location: '/' });
      res.end();
      return;
    }
    if (pathname.startsWith('/sistechwork/')) {
      const cleanPath = pathname.replace(/^\/sistechwork/, '');
      res.writeHead(301, { Location: cleanPath || '/' });
      res.end();
      return;
    }

    // Serve root index.html
    if (pathname === '/' || pathname === '') {
      pathname = '/index.html';
    }

    let filePath = join(DIST_DIR, pathname);

    // Check if file exists or if it's a directory
    if (existsSync(filePath)) {
      const stats = await stat(filePath);
      if (stats.isDirectory()) {
        if (!pathname.endsWith('/')) {
          res.writeHead(301, { Location: pathname + '/' });
          res.end();
          return;
        }
        filePath = join(filePath, 'index.html');
      }
    } else if (existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else if (existsSync(join(DIST_DIR, pathname, 'index.html'))) {
      filePath = join(DIST_DIR, pathname, 'index.html');
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + pathname);
      return;
    }

    const ext = extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const data = await readFile(filePath);

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
    });
    res.end(data);
  } catch (err) {
    console.error('Server error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Internal Server Error');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Sistechwork server running on port ${PORT}`);
});
