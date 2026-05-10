const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { formidable } = require('formidable');
const { mkdir, writeFile } = require('fs/promises');
const { join } = require('path');
const { existsSync } = require('fs');
const { randomUUID } = require('crypto');

const dev = false;
const hostname = '0.0.0.0';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Simple cookie parser
function parseCookies(cookieStr) {
  const cookies = {};
  if (!cookieStr) return cookies;
  cookieStr.split(';').forEach(c => {
    const [key, val] = c.trim().split('=');
    cookies[key] = val;
  });
  return cookies;
}

// Check if request is authenticated
function isAuthenticated(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  return cookies.prakasa_admin_session === 'prakasa_authenticated_2024';
}

// Handle file upload directly (bypasses Next.js routing)
async function handleUpload(req, res) {
  if (!isAuthenticated(req)) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized' }));
    return;
  }

  try {
    const form = formidable({
      maxFileSize: MAX_FILE_SIZE,
      multiples: true,
    });

    const [fields, files] = await form.parse(req);
    
    // Get folder from form field
    const folderRaw = fields.folder;
    const folder = (Array.isArray(folderRaw) ? folderRaw[0] : folderRaw) || 'projects';
    
    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', folder);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    const urls = [];
    const warnings = [];
    const compression = [];

    // formidable returns files as arrays
    const fileArray = files.files || [];

    for (const file of fileArray) {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.mimetype)) {
        warnings.push(`${file.originalFilename}: Tipe file ${file.mimetype} tidak didukung`);
        continue;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        warnings.push(`${file.originalFilename}: File terlalu besar (maks 10MB)`);
        continue;
      }

      // Generate unique filename
      const ext = file.originalFilename.split('.').pop() || 'jpg';
      const timestamp = Date.now();
      const randomSuffix = randomUUID().split('-')[0];
      const filename = `${timestamp}-${randomSuffix}.${ext}`;

      // Copy file from temp to upload dir
      const destPath = join(uploadDir, filename);
      const { readFile } = require('fs/promises');
      const data = await readFile(file.filepath);
      await writeFile(destPath, data);

      // Clean up temp file
      try { require('fs').unlinkSync(file.filepath); } catch {}

      const url = `/uploads/${folder}/${filename}`;
      urls.push(url);

      const sizeKB = Math.round(file.size / 1024);
      compression.push(`${file.originalFilename}: ${sizeKB}KB → ${url}`);
    }

    if (urls.length === 0) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Tidak ada file yang berhasil diunggah',
        warnings: warnings.length > 0 ? warnings : undefined,
      }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      urls,
      warnings: warnings.length > 0 ? warnings : undefined,
      compression,
      count: urls.length,
    }));
  } catch (error) {
    console.error('Upload error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Gagal mengunggah file' }));
  }
}

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const pathname = parsedUrl.pathname;

      // Intercept upload requests BEFORE they reach Next.js
      if (req.method === 'POST' && (pathname === '/api/admin/upload-photo' || pathname === '/api/admin/upload')) {
        // folder will be extracted from the form data in handleUpload
        await handleUpload(req, res);
        return;
      }

      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  server.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });

  // Keep process alive
  process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection:', reason);
  });
});
