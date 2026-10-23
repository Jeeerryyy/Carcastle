/**
 * Zero-Dependency CSS & JS Minifier for Car Castle Goa
 * Produces production-ready minified assets (.min.css, .min.js)
 */
const fs = require('fs');
const path = require('path');

const CSS_DIR = path.resolve(__dirname, '..', 'carcastlegoa', 'css');
const JS_DIR = path.resolve(__dirname, '..', 'carcastlegoa', 'js');
const ADMIN_CSS_DIR = path.resolve(__dirname, '..', 'carcastlegoa', 'admin', 'css');

function minifyCSS(css) {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove space around delimiters
    .replace(/\s*([\{\}\:\;\,])\s*/g, '$1')
    // Remove redundant semicolons before closing brace
    .replace(/;\}/g, '}')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

function minifyJS(js) {
  return js
    // Remove single line comments (safely checking not in string)
    .replace(/(^|[^\\])\/\/.*$/gm, '$1')
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Collapse multiple blank lines
    .replace(/\n\s*\n/g, '\n')
    // Trim each line
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join('\n');
}

function run() {
  console.log('--- Car Castle Goa: Asset Minification ---');

  // Minify Public CSS
  const publicCssPath = path.join(CSS_DIR, 'styles.css');
  if (fs.existsSync(publicCssPath)) {
    const raw = fs.readFileSync(publicCssPath, 'utf8');
    const minified = minifyCSS(raw);
    const dest = path.join(CSS_DIR, 'styles.min.css');
    fs.writeFileSync(dest, minified, 'utf8');
    const savings = ((1 - minified.length / raw.length) * 100).toFixed(1);
    console.log(`[CSS] styles.css (${(raw.length / 1024).toFixed(1)} KB) -> styles.min.css (${(minified.length / 1024).toFixed(1)} KB) | Saved: ${savings}%`);
  }

  // Minify Admin CSS
  const adminCssPath = path.join(ADMIN_CSS_DIR, 'admin.css');
  if (fs.existsSync(adminCssPath)) {
    const raw = fs.readFileSync(adminCssPath, 'utf8');
    const minified = minifyCSS(raw);
    const dest = path.join(ADMIN_CSS_DIR, 'admin.min.css');
    fs.writeFileSync(dest, minified, 'utf8');
    const savings = ((1 - minified.length / raw.length) * 100).toFixed(1);
    console.log(`[CSS] admin.css (${(raw.length / 1024).toFixed(1)} KB) -> admin.min.css (${(minified.length / 1024).toFixed(1)} KB) | Saved: ${savings}%`);
  }

  // Minify Public JS
  const jsFiles = ['main.js', 'cars-filter.js', 'analytics.js'];
  for (const jsFile of jsFiles) {
    const srcPath = path.join(JS_DIR, jsFile);
    if (fs.existsSync(srcPath)) {
      const raw = fs.readFileSync(srcPath, 'utf8');
      const minified = minifyJS(raw);
      const minName = jsFile.replace('.js', '.min.js');
      const dest = path.join(JS_DIR, minName);
      fs.writeFileSync(dest, minified, 'utf8');
      const savings = ((1 - minified.length / raw.length) * 100).toFixed(1);
      console.log(`[JS] ${jsFile} (${(raw.length / 1024).toFixed(1)} KB) -> ${minName} (${(minified.length / 1024).toFixed(1)} KB) | Saved: ${savings}%`);
    }
  }

  console.log('🎉 Production asset minification completed successfully.');
}

run();
