const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const PORT = parseInt(process.env.PORT || process.argv[2] || '8613', 10);
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webp': 'image/webp' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(path.normalize(ROOT))) { res.writeHead(403); res.end(); return; }
  fs.readFile(f, (e, d) => {
    if (e) {
      fs.readFile(path.join(ROOT, '404.html'), (e2, d2) => {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(e2 ? '404' : d2);
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' });
    res.end(d);
  });
}).listen(PORT, () => console.log('kwsite server up on http://localhost:' + PORT));
