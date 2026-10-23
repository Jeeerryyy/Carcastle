/**
 * Car Castle Goa - Vercel Serverless Public Config Endpoint (/api/config)
 * Safely exposes public Supabase & Cloudinary credentials to frontend visitors
 * so cloud database connectivity works out-of-the-box in production.
 */
module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') return res.status(204).end();
    res.statusCode = 204;
    return res.end();
  }

  const config = {
    supabaseUrl: (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim(),
    supabaseAnonKey: (process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim(),
    cloudinaryCloudName: (process.env.CLOUDINARY_CLOUD_NAME || '').trim(),
    cloudinaryUploadPreset: (process.env.CLOUDINARY_UPLOAD_PRESET || '').trim(),
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString()
  };

  if (typeof res.status === 'function') {
    return res.status(200).json(config);
  }
  res.statusCode = 200;
  res.end(JSON.stringify(config));
};
