const http = require('http');
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

// Auto-load .env environment file if present (Node.js native, zero dependencies)
try {
  const envPath = path.resolve(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch (e) {}

const PORT = process.env.PORT || 8080;
const ROOT = path.resolve(__dirname, 'carcastlegoa');
const START_TIME = Date.now();

// Comprehensive MIME Type Registry
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json'
};

// Rate Limiter: In-memory sliding window (180 requests/minute per IP)
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 180;
const clientRequests = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  let client = clientRequests.get(ip);
  if (!client || now - client.windowStart > RATE_LIMIT_WINDOW_MS) {
    client = { windowStart: now, count: 1 };
    clientRequests.set(ip, client);
    return false;
  }
  client.count++;
  return client.count > RATE_LIMIT_MAX_REQUESTS;
}

// Periodic cleanup of stale rate limiter entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, client] of clientRequests.entries()) {
    if (now - client.windowStart > RATE_LIMIT_WINDOW_MS * 2) {
      clientRequests.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref();

// Robust Content-Security-Policy supporting Supabase, Cloudinary, Fonts, and Analytics
const CSP_HEADER = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://esm.sh https://widget.cloudinary.com https://upload-widget.cloudinary.com https://www.gstatic.com https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://res.cloudinary.com https://*.supabase.co https://www.google-analytics.com https://*.google.com https://*.gstatic.com",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.cloudinary.com https://res.cloudinary.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.google-analytics.com https://*.google-analytics.com",
  "frame-src 'self' https://www.google.com https://maps.google.com https://widget.cloudinary.com https://upload-widget.cloudinary.com",
  "object-src 'none'",
  "base-uri 'self'"
].join('; ');

// Real-time Fleet Live Synchronization (SSE) & Persistence
const sseClients = new Set();
const CARS_JSON_PATH = path.resolve(ROOT, 'data', 'cars.json');

function broadcastFleet(fleet) {
  const payload = `event: fleet\ndata: ${JSON.stringify(fleet)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch (err) {
      sseClients.delete(client);
    }
  }
}

// Keep SSE connections alive with heartbeat ping every 25 seconds
setInterval(() => {
  for (const client of sseClients) {
    try {
      client.write(': ping\n\n');
    } catch (err) {
      sseClients.delete(client);
    }
  }
}, 25000).unref();

const server = http.createServer(async (req, res) => {
  const reqStart = Date.now();
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';

  // Structured access logger
  const logResponse = (statusCode, byteCount = 0) => {
    const duration = Date.now() - reqStart;
    const isoTime = new Date().toISOString();
    console.log(`[${isoTime}] ${clientIp} - ${req.method} ${req.url} -> ${statusCode} (${duration}ms, ${byteCount}B)`);
  };

  // Enforce Rate Limiting
  if (isRateLimited(clientIp)) {
    res.writeHead(429, {
      'Content-Type': 'application/json',
      'Retry-After': '60'
    });
    res.end(JSON.stringify({ error: 'Too Many Requests', message: 'Rate limit exceeded. Please retry in 1 minute.' }));
    logResponse(429);
    return;
  }

  // Parse path and enforce safety against directory traversal
  let rawPath;
  try {
    rawPath = decodeURIComponent(req.url.split('?')[0]);
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request');
    logResponse(400);
    return;
  }

  // Health and Observability Endpoints
  if (rawPath === '/health') {
    const healthPayload = JSON.stringify({
      status: 'healthy',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      service: 'Car Castle Goa Web Server'
    });
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
    res.end(healthPayload);
    logResponse(200, healthPayload.length);
    return;
  }

  if (rawPath === '/status') {
    const statusPayload = JSON.stringify({
      status: 'online',
      nodeVersion: process.version,
      memory: process.memoryUsage(),
      activeIps: clientRequests.size,
      serverTime: new Date().toISOString(),
      uptimeHours: (process.uptime() / 3600).toFixed(2),
      supabaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
    }, null, 2);
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' });
    res.end(statusPayload);
    logResponse(200, statusPayload.length);
    return;
  }

  // Public Configuration Endpoint for Frontend Supabase & Cloudinary Connectivity
  if (rawPath === '/api/config') {
    const configPayload = JSON.stringify({
      supabaseUrl: (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim(),
      supabaseAnonKey: (process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim(),
      cloudinaryCloudName: (process.env.CLOUDINARY_CLOUD_NAME || '').trim(),
      cloudinaryUploadPreset: (process.env.CLOUDINARY_UPLOAD_PRESET || '').trim(),
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(configPayload);
    logResponse(200, configPayload.length);
    return;
  }

  // Alias /cars or /cars.html to /all-cars.html
  if (rawPath === '/cars' || rawPath === '/cars/' || rawPath === '/cars.html') {
    res.writeHead(301, { 'Location': '/all-cars.html' });
    res.end();
    logResponse(301);
    return;
  }

  // Server-Sent Events (SSE) Live Stream: Instant updates pushed to all open tabs and devices
  if (rawPath === '/api/cars/stream') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write(': connected\n\n');
    sseClients.add(res);

    // Send initial fleet state immediately
    fsPromises.readFile(CARS_JSON_PATH, 'utf-8').then(data => {
      try {
        const fleet = JSON.parse(data);
        res.write(`event: fleet\ndata: ${JSON.stringify(fleet)}\n\n`);
      } catch (e) {}
    }).catch(() => {});

    req.on('close', () => {
      sseClients.delete(res);
    });
    logResponse(200);
    return;
  }

  // Fleet CRUD & Persistence API Endpoint
  if (rawPath === '/api/cars') {
    if (req.method === 'GET') {
      try {
        const data = await fsPromises.readFile(CARS_JSON_PATH, 'utf-8');
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(data);
        logResponse(200, data.length);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to read fleet data' }));
        logResponse(500);
      }
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
        if (body.length > 5 * 1024 * 1024) {
          req.destroy();
        }
      });

      req.on('end', async () => {
        try {
          const parsed = JSON.parse(body);
          const fleet = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.fleet) ? parsed.fleet : null);
          if (!fleet) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid payload: fleet array required' }));
            logResponse(400);
            return;
          }

          // Persist directly to cars.json on disk
          await fsPromises.writeFile(CARS_JSON_PATH, JSON.stringify(fleet, null, 2), 'utf-8');

          // If Supabase is configured in environment, sync directly to Supabase as well
          const sbUrl = (process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
          const sbKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
          if (sbUrl && sbKey) {
            try {
              await fetch(`${sbUrl}/rest/v1/cars`, {
                method: 'POST',
                headers: {
                  'apikey': sbKey,
                  'Authorization': `Bearer ${sbKey}`,
                  'Content-Type': 'application/json',
                  'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify(fleet)
              });
            } catch (sbErr) {
              console.warn('Local server Supabase sync notice:', sbErr.message);
            }
          }

          // Broadcast to all active browsers, tabs, and devices in real-time
          broadcastFleet(fleet);

          const responsePayload = JSON.stringify({ success: true, count: fleet.length });
          res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(responsePayload);
          logResponse(200, responsePayload.length);
        } catch (err) {
          console.error('Error saving fleet via API:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to save fleet: ' + err.message }));
          logResponse(500);
        }
      });
      return;
    }
  }

  // Sanitize path
  let safeRelPath = path.normalize(rawPath).replace(/^(\.\.[\/\\])+/, '');
  if (safeRelPath === '/' || safeRelPath === '\\') safeRelPath = 'index.html';
  if (safeRelPath.startsWith('/') || safeRelPath.startsWith('\\')) safeRelPath = safeRelPath.slice(1);

  let candidatePath = path.resolve(ROOT, safeRelPath);

  // Security guard: Ensure resolved path resides inside ROOT
  if (!candidatePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    logResponse(403);
    return;
  }

  try {
    // Check if target is directory -> enforce trailing slash for correct relative asset loading
    let stats;
    try {
      stats = await fsPromises.stat(candidatePath);
      if (stats.isDirectory()) {
        if (!rawPath.endsWith('/') && rawPath !== '') {
          const queryString = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
          res.writeHead(301, {
            'Location': rawPath + '/' + queryString,
            'Content-Type': 'text/plain'
          });
          res.end('Redirecting to directory with trailing slash');
          logResponse(301);
          return;
        }
        candidatePath = path.join(candidatePath, 'index.html');
        stats = await fsPromises.stat(candidatePath);
      }
    } catch (e) {
      // Try clean URL resolution: e.g. /all-cars -> /all-cars.html
      try {
        const withHtml = candidatePath + '.html';
        stats = await fsPromises.stat(withHtml);
        candidatePath = withHtml;
      } catch (errHtml) {
        // Not found
        stats = null;
      }
    }

    // Handle 404
    if (!stats || !stats.isFile()) {
      const notFoundPage = path.join(ROOT, '404.html');
      try {
        const notFoundStats = await fsPromises.stat(notFoundPage);
        res.writeHead(404, {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Length': notFoundStats.size,
          'Content-Security-Policy': CSP_HEADER,
          'X-Content-Type-Options': 'nosniff'
        });
        const stream = fs.createReadStream(notFoundPage);
        stream.pipe(res);
        logResponse(404, notFoundStats.size);
      } catch (err404) {
        const fallback = '<h1>404 Not Found</h1><p>Cannot find the requested page.</p><p><a href="/">Return Home</a></p>';
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fallback);
        logResponse(404, fallback.length);
      }
      return;
    }

    const ext = path.extname(candidatePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Security & Performance Headers
    const headers = {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Content-Security-Policy': CSP_HEADER,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)'
    };

    // Cache strategy: Never cache scripts, styles, or html on localhost/dev
    if (['.html', '.js', '.mjs', '.css', '.json'].includes(ext)) {
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      headers['Pragma'] = 'no-cache';
      headers['Expires'] = '0';
    } else if (['.jpg', '.jpeg', '.png', '.webp', '.svg', '.ico', '.woff2'].includes(ext)) {
      headers['Cache-Control'] = 'public, max-age=604800, immutable'; // 7 days
    } else {
      headers['Cache-Control'] = 'no-cache, must-revalidate';
    }

    res.writeHead(200, headers);
    const readStream = fs.createReadStream(candidatePath);
    readStream.on('error', (streamErr) => {
      console.error('File stream error:', streamErr);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
    });
    readStream.pipe(res);
    logResponse(200, stats.size);

  } catch (unhandledErr) {
    console.error('Request processing error:', unhandledErr);
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
    logResponse(500);
  }
});

// Process resilience guards
process.on('uncaughtException', (err) => {
  console.error('[FATAL UNCAUGHT EXCEPTION]', new Date().toISOString(), err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[UNHANDLED REJECTION]', new Date().toISOString(), reason);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Car Castle Goa Production-Ready Server running at:`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Health:  http://localhost:${PORT}/health`);
  console.log(`  Status:  http://localhost:${PORT}/status`);
});
