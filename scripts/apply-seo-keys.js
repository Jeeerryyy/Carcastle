/**
 * 1-Click SEO & Analytics Key Injection Tool for Car Castle Goa
 *
 * Automatically reads GOOGLE_SEARCH_CONSOLE_CODE, BING_VERIFICATION_CODE, and GA4_MEASUREMENT_ID
 * from .env file (or CLI arguments) and updates all 43+ public HTML files & analytics.js.
 *
 * Usage:
 *   node scripts/apply-seo-keys.js
 *   node scripts/apply-seo-keys.js --gsc="GSC_CODE" --bing="BING_CODE" --ga4="G-12345678"
 */

const fs = require('fs');
const path = require('path');
require('../config/env.js');

const ROOT = path.resolve(__dirname, '..', 'carcastlegoa');
const GSC_KEY = process.env.GOOGLE_SEARCH_CONSOLE_CODE || '[YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE]';
const BING_KEY = process.env.BING_VERIFICATION_CODE || '[YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE]';
const GA4_KEY = process.env.GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX';

function findHtmlFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'admin' && entry.name !== 'node_modules') {
        findHtmlFiles(fullPath, fileList);
      }
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function run() {
  console.log('--- Car Castle Goa: 1-Click SEO & Analytics Key Manager ---');
  console.log(`Current Configuration:`);
  console.log(`  Google Search Console: ${GSC_KEY}`);
  console.log(`  Bing Verification:     ${BING_KEY}`);
  console.log(`  GA4 Measurement ID:    ${GA4_KEY}\n`);

  if (GSC_KEY.startsWith('[YOUR_') && GA4_KEY === 'G-XXXXXXXXXX') {
    console.log('ℹ️  Placeholders are active in .env. When you receive your real keys from Google & Bing:');
    console.log('    1. Open .env and replace the values for GOOGLE_SEARCH_CONSOLE_CODE & GA4_MEASUREMENT_ID');
    console.log('    2. Run: npm run seo:keys');
    console.log('    All 43+ pages will be automatically updated!\n');
    return;
  }

  const htmlFiles = findHtmlFiles(ROOT);
  let updatedCount = 0;

  for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Update GSC meta tag
    if (content.includes('name="google-site-verification"')) {
      content = content.replace(/content="\[YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE\]"/g, `content="${GSC_KEY}"`);
      modified = true;
    }

    // Update Bing meta tag
    if (content.includes('name="msvalidate.01"')) {
      content = content.replace(/name="msvalidate\.01"\s+content="[^"]*"/g, `name="msvalidate.01" content="${BING_KEY}"`);
      modified = true;
    }

    // Update GA4 Script ID if embedded
    if (content.includes('G-XXXXXXXXXX')) {
      content = content.replace(/G-XXXXXXXXXX/g, GA4_KEY);
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      updatedCount++;
    }
  }

  // Update analytics.js
  const analyticsPath = path.join(ROOT, 'js', 'analytics.js');
  if (fs.existsSync(analyticsPath)) {
    let analyticsContent = fs.readFileSync(analyticsPath, 'utf8');
    if (analyticsContent.includes('G-XXXXXXXXXX')) {
      analyticsContent = analyticsContent.replace(/'G-XXXXXXXXXX'/g, `'${GA4_KEY}'`);
      fs.writeFileSync(analyticsPath, analyticsContent, 'utf8');
      console.log('✅ Updated carcastlegoa/js/analytics.js with live GA4 Measurement ID');
    }
  }

  console.log(`🎉 Successfully applied SEO and Analytics keys across ${updatedCount} HTML pages!`);
}

run();
