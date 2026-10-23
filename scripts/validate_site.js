const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'carcastlegoa');

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = getAllHtmlFiles(root);
console.log(`--- Car Castle Goa: HTML5 & SEO Validator ---`);
console.log(`Validating ${htmlFiles.length} HTML files across the project...\n`);

const titles = new Map();
const descriptions = new Map();
let issues = [];

htmlFiles.forEach(filePath => {
  const relPath = path.relative(root, filePath).replace(/\\/g, '/');
  const content = fs.readFileSync(filePath, 'utf8');

  if (relPath.includes('node_modules')) return;

  // 1. Language tag
  if (!content.includes('lang="en-IN"') && !content.includes('lang="en"')) {
    issues.push(`[${relPath}] Missing or invalid <html> lang attribute`);
  }

  // 2. Viewport
  if (!content.includes('name="viewport"')) {
    issues.push(`[${relPath}] Missing viewport meta tag`);
  }

  // 3. Title check
  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  if (!titleMatch) {
    issues.push(`[${relPath}] Missing <title> tag`);
  } else {
    const title = titleMatch[1].trim();
    if (title.length < 20) {
      issues.push(`[${relPath}] Title is too short (${title.length} chars): "${title}"`);
    }
    if (titles.has(title)) {
      issues.push(`[${relPath}] Duplicate title found with [${titles.get(title)}]: "${title}"`);
    } else {
      titles.set(title, relPath);
    }
  }

  // 4. Meta Description check
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i) ||
                    content.match(/<meta\s+content=["']([\s\S]*?)["']\s+name=["']description["']/i);
  if (!descMatch && !relPath.includes('404')) {
    issues.push(`[${relPath}] Missing meta description`);
  } else if (descMatch) {
    const desc = descMatch[1].trim();
    if (descriptions.has(desc) && !relPath.includes('404')) {
      issues.push(`[${relPath}] Duplicate meta description found with [${descriptions.get(desc)}]: "${desc.substring(0, 40)}..."`);
    } else {
      descriptions.set(desc, relPath);
    }
  }

  // 5. Canonical tag
  if (!content.includes('rel="canonical"') && !relPath.includes('404')) {
    issues.push(`[${relPath}] Missing canonical link`);
  }

  // 6. H1 count
  const h1Matches = content.match(/<h1[\s>]/gi);
  if (!h1Matches) {
    issues.push(`[${relPath}] Missing <h1> tag`);
  } else if (h1Matches.length > 1) {
    issues.push(`[${relPath}] Multiple <h1> tags found (${h1Matches.length})`);
  }

  // 7. Image alt tags
  const imgMatches = content.matchAll(/<img\s+([^>]*?)>/gi);
  for (const img of imgMatches) {
    const attrs = img[1];
    if (!attrs.includes('alt=')) {
      issues.push(`[${relPath}] Image missing alt attribute: ${img[0].substring(0, 60)}...`);
    }
  }

  // 8. JSON-LD validation
  const jsonLdMatches = content.matchAll(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi);
  for (const jsonLd of jsonLdMatches) {
    try {
      JSON.parse(jsonLd[1]);
    } catch (e) {
      issues.push(`[${relPath}] Invalid JSON-LD schema syntax: ${e.message}`);
    }
  }
});

console.log('--- VALIDATION SUMMARY ---');
if (issues.length === 0) {
  console.log('✅ PASSED! All pages have unique titles, unique descriptions, single H1, valid JSON-LD schemas, and valid image alt attributes.');
} else {
  console.log(`Found ${issues.length} potential issues:`);
  issues.forEach(iss => console.log(' - ' + iss));
  process.exit(1);
}
