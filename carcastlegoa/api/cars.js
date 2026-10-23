/**
 * Car Castle Goa - Vercel Serverless Fleet API Endpoint (/api/cars)
 * Reads and writes fleet records to Supabase PostgreSQL in production,
 * with zero-config fallback to bundled cars.json.
 */
const fs = require('fs');
const path = require('path');

function sendJson(res, statusCode, data) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey');

  if (typeof res.status === 'function') {
    return res.status(statusCode).json(data);
  }
  res.statusCode = statusCode;
  res.end(JSON.stringify(data));
}

async function getRequestBody(req) {
  if (req.body) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 5 * 1024 * 1024) req.destroy();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function getLocalCars() {
  const possiblePaths = [
    path.join(process.cwd(), 'carcastlegoa', 'data', 'cars.json'),
    path.join(process.cwd(), 'data', 'cars.json'),
    path.join(__dirname, '..', 'carcastlegoa', 'data', 'cars.json'),
    path.join(__dirname, '..', 'data', 'cars.json')
  ];

  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      }
    } catch (e) {}
  }
  return [];
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey');
    if (typeof res.status === 'function') return res.status(204).end();
    res.statusCode = 204;
    return res.end();
  }

  const supabaseUrl = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/\/+$/, '');
  const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

  // GET: Read Fleet
  if (req.method === 'GET') {
    if (supabaseUrl && supabaseKey) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/cars?select=*&order=order.asc`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });

        if (response.ok) {
          const rows = await response.json();
          if (Array.isArray(rows) && rows.length > 0) {
            return sendJson(res, 200, rows);
          }
        }
      } catch (err) {
        console.warn('Vercel API: Supabase query warning (falling back to local cars.json):', err.message);
      }
    }

    // Fallback to local cars.json
    const fallbackCars = getLocalCars();
    return sendJson(res, 200, fallbackCars);
  }

  // POST: Create or Update Fleet
  if (req.method === 'POST') {
    try {
      const payload = await getRequestBody(req);
      const fleet = Array.isArray(payload) ? payload : (Array.isArray(payload.fleet) ? payload.fleet : null);

      if (!fleet) {
        return sendJson(res, 400, { error: 'Invalid payload: array of cars required' });
      }

      if (supabaseUrl && supabaseKey) {
        try {
          const resSupabase = await fetch(`${supabaseUrl}/rest/v1/cars`, {
            method: 'POST',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify(fleet)
          });

          if (!resSupabase.ok) {
            const errText = await resSupabase.text();
            throw new Error(`Supabase upsert failed (${resSupabase.status}): ${errText}`);
          }
        } catch (sbErr) {
          console.error('Supabase write error in /api/cars:', sbErr);
          return sendJson(res, 500, { error: sbErr.message });
        }
      }

      // Also try to persist locally if filesystem is writable (e.g. local dev server)
      try {
        const localPath = path.join(process.cwd(), 'carcastlegoa', 'data', 'cars.json');
        if (fs.existsSync(localPath)) {
          fs.writeFileSync(localPath, JSON.stringify(fleet, null, 2), 'utf8');
        }
      } catch (e) {}

      return sendJson(res, 200, { success: true, count: fleet.length });
    } catch (err) {
      console.error('API Error in /api/cars POST:', err);
      return sendJson(res, 500, { error: err.message });
    }
  }

  return sendJson(res, 405, { error: 'Method Not Allowed' });
};
