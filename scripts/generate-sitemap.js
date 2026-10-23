/**
 * Dynamic Sitemap Generator for Car Castle Goa
 * Auto-discovers all HTML pages and updates sitemap.xml with accurate lastmod and priority.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'carcastlegoa');
const BASE_URL = 'https://carcastlegoa.com';

function findPages(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'admin' && entry.name !== 'node_modules') {
        findPages(fullPath, list);
      }
    } else if (entry.isFile() && entry.name.endsWith('.html') && entry.name !== '404.html') {
      const relPath = path.relative(ROOT, fullPath).replace(/\\/g, '/');
      const stats = fs.statSync(fullPath);
      list.push({
        relPath,
        mtime: stats.mtime.toISOString().split('T')[0]
      });
    }
  }
  return list;
}

function getPriority(relPath) {
  if (relPath === 'index.html') return { priority: '1.0', changefreq: 'daily' };
  if (['all-cars.html', 'reg-cars.html', 'prem-cars.html'].includes(relPath)) return { priority: '0.9', changefreq: 'daily' };
  if (relPath.startsWith('cars/')) return { priority: '0.8', changefreq: 'weekly' };
  if (relPath.startsWith('locations/') || relPath.startsWith('services/')) return { priority: '0.8', changefreq: 'weekly' };
  if (relPath.startsWith('blog/')) return { priority: '0.7', changefreq: 'weekly' };
  if (['pricing.html', 'about.html', 'contact.html', 'how-it-works.html'].includes(relPath)) return { priority: '0.7', changefreq: 'monthly' };
  return { priority: '0.5', changefreq: 'monthly' };
}

function run() {
  console.log('--- Car Castle Goa: Dynamic Sitemap Generator ---');
  const pages = findPages(ROOT);

  // Sort: index first, then all-cars, then rest alphabetically
  pages.sort((a, b) => {
    if (a.relPath === 'index.html') return -1;
    if (b.relPath === 'index.html') return 1;
    return a.relPath.localeCompare(b.relPath);
  });

  const urlsXml = pages.map(p => {
    const loc = p.relPath === 'index.html' ? `${BASE_URL}/` : `${BASE_URL}/${p.relPath}`;
    const { priority, changefreq } = getPriority(p.relPath);
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${p.mtime}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');

  console.log(`🎉 sitemap.xml generated successfully with ${pages.length} URLs!`);
}

run();
