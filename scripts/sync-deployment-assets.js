/**
 * Synchronize Vercel & Supabase Deployment Artifacts
 * Guarantees zero-config deployment regardless of whether Vercel Root Directory is set to '.' or 'carcastlegoa'.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const WEB_ROOT = path.resolve(ROOT, 'carcastlegoa');

console.log('--- Car Castle Goa: Deployment Artifact Synchronizer ---');

// 1. Sync /api directory into carcastlegoa/api
const srcApi = path.join(ROOT, 'api');
const destApi = path.join(WEB_ROOT, 'api');
if (fs.existsSync(srcApi)) {
  fs.mkdirSync(destApi, { recursive: true });
  const apiFiles = fs.readdirSync(srcApi);
  for (const file of apiFiles) {
    fs.copyFileSync(path.join(srcApi, file), path.join(destApi, file));
  }
  console.log(`[API] Synchronized ${apiFiles.length} serverless functions into carcastlegoa/api/`);
}

// 2. Sync vercel.json into carcastlegoa/vercel.json (adapted for direct web-root deployment if root set to carcastlegoa)
const rootVercel = path.join(ROOT, 'vercel.json');
if (fs.existsSync(rootVercel)) {
  const rootConfig = JSON.parse(fs.readFileSync(rootVercel, 'utf8'));
  const webConfig = { ...rootConfig };
  delete webConfig.outputDirectory; // In web root, output is .
  fs.writeFileSync(path.join(WEB_ROOT, 'vercel.json'), JSON.stringify(webConfig, null, 2), 'utf8');
  console.log('[Vercel] Generated compatible carcastlegoa/vercel.json for sub-directory root hosting.');
}

// 3. Sync supabase/schema.sql to root schema.sql and carcastlegoa/schema.sql
const srcSchema = path.join(ROOT, 'supabase', 'schema.sql');
if (fs.existsSync(srcSchema)) {
  fs.copyFileSync(srcSchema, path.join(ROOT, 'schema.sql'));
  fs.copyFileSync(srcSchema, path.join(WEB_ROOT, 'schema.sql'));
  console.log('[Supabase] Synchronized production SQL schema to schema.sql and carcastlegoa/schema.sql');
}

console.log('🎉 Deployment artifacts synchronized successfully.');
