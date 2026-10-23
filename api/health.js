/**
 * Car Castle Goa - Vercel Serverless Observability & Health Check (/api/health)
 */
module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const supabaseConfigured = Boolean(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    (process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );

  const health = {
    status: 'healthy',
    service: 'Car Castle Rentals Goa',
    platform: 'Vercel Serverless',
    database: supabaseConfigured ? 'Supabase PostgreSQL' : 'Local Fleet JSON',
    uptimeSeconds: Math.floor(process.uptime()),
    nodeVersion: process.version,
    region: process.env.VERCEL_REGION || 'local',
    timestamp: new Date().toISOString()
  };

  if (typeof res.status === 'function') {
    return res.status(200).json(health);
  }
  res.statusCode = 200;
  res.end(JSON.stringify(health));
};
