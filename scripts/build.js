/**
 * Master Unified Build Orchestrator for Car Castle Goa
 * Executes all compilation, optimization, minification, sitemap, and validation steps.
 */
const { execSync } = require('child_process');

function step(title, cmd) {
  console.log(`\n======================================================`);
  console.log(`>>> ${title}`);
  console.log(`======================================================`);
  execSync(cmd, { stdio: 'inherit' });
}

try {
  console.log('🚀 Initiating Full Production Build for Car Castle Goa...');

  step('1. Compiling Shared HTML Templates & Partials', 'node scripts/compile-templates.js');
  step('2. Minifying Production CSS & JavaScript Assets', 'node scripts/minify-assets.js');
  step('3. Updating Dynamic Sitemap.xml', 'node scripts/generate-sitemap.js');
  step('4. Running Automated HTML5, SEO & Schema Validation', 'node scripts/validate_site.js');
  step('5. Synchronizing Vercel & Supabase Deployment Artifacts', 'node scripts/sync-deployment-assets.js');

  console.log('\n✨ PRODUCTION BUILD COMPLETED WITH 100% SUCCESS! ✨\n');
} catch (err) {
  console.error('\n❌ Build Orchestration Failed:', err.message);
  process.exit(1);
}
