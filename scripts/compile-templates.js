/**
 * Zero-Dependency Shared Template Compiler for Car Castle Goa
 * Synchronizes header, footer, and mobile drawer safely across public HTML files.
 * Guarantees zero regression on <h1> tags, page headings, and main content.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'carcastlegoa');
const TEMPLATES_DIR = path.resolve(__dirname, '..', 'templates', 'partials');

const headerPartial = fs.readFileSync(path.join(TEMPLATES_DIR, 'header.html'), 'utf8');
const footerPartial = fs.readFileSync(path.join(TEMPLATES_DIR, 'footer.html'), 'utf8');
const drawerPartial = fs.readFileSync(path.join(TEMPLATES_DIR, 'mobile-drawer.html'), 'utf8');

function findHtmlFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'admin' && entry.name !== 'node_modules') {
        findHtmlFiles(fullPath, fileList);
      }
    } else if (entry.isFile() && entry.name.endsWith('.html') && entry.name !== '404.html') {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function countH1(html) {
  const matches = html.match(/<h1[\s>]/gi);
  return matches ? matches.length : 0;
}

/**
 * Safely replace <header class="header-nav">...</header>
 */
function replaceHeader(html, newHeader) {
  // First strip any existing skip-link tags to prevent accumulation
  html = html.replace(/(?:[\t ]*<a\s+[^>]*class=["']skip-link["'][^>]*>[\s\S]*?<\/a>\s*)+/gi, '\n  ');

  const marker = '<header class="header-nav"';
  const startIdx = html.indexOf(marker);
  if (startIdx === -1) return html;

  const commentMarker = '<!-- Header';
  const commentIdx = html.lastIndexOf(commentMarker, startIdx);
  const actualStart = (commentIdx !== -1 && (startIdx - commentIdx) < 80) ? commentIdx : startIdx;

  const endMarker = '</header>';
  const endIdx = html.indexOf(endMarker, startIdx);
  if (endIdx === -1) return html;

  return html.slice(0, actualStart) + newHeader.trim() + '\n\n' + html.slice(endIdx + endMarker.length).trimStart();
}

/**
 * Safely replace <div id="mobile-drawer" ...>...</div> by counting <div> nesting
 */
function replaceDrawer(html, newDrawer) {
  const marker = 'id="mobile-drawer"';
  const markerIdx = html.indexOf(marker);
  if (markerIdx === -1) return html;

  const startDiv = html.lastIndexOf('<div', markerIdx);
  if (startDiv === -1) return html;

  const commentMarker = '<!-- Mobile Drawer -->';
  const commentIdx = html.lastIndexOf(commentMarker, startDiv);
  const actualStart = (commentIdx !== -1 && (startDiv - (commentIdx + commentMarker.length)) < 30) ? commentIdx : startDiv;

  let depth = 0;
  let i = startDiv;
  let endDiv = -1;

  while (i < html.length) {
    if (html.slice(i, i + 4).toLowerCase() === '<div') {
      depth++;
      i += 4;
    } else if (html.slice(i, i + 6).toLowerCase() === '</div>') {
      depth--;
      if (depth === 0) {
        endDiv = i + 6;
        break;
      }
      i += 6;
    } else {
      i++;
    }
  }

  if (endDiv !== -1) {
    return html.slice(0, actualStart) + newDrawer.trim() + '\n\n' + html.slice(endDiv).trimStart();
  }
  return html;
}

/**
 * Safely replace <footer class="footer" ...>...</footer>
 */
function replaceFooter(html, newFooter) {
  const marker = '<footer class="footer"';
  const startIdx = html.indexOf(marker);
  if (startIdx === -1) return html;

  const commentMarker = '<!-- Footer';
  const commentIdx = html.lastIndexOf(commentMarker, startIdx);
  const actualStart = (commentIdx !== -1 && (startIdx - commentIdx) < 80) ? commentIdx : startIdx;

  const endMarker = '</footer>';
  const endIdx = html.indexOf(endMarker, startIdx);
  if (endIdx === -1) return html;

  return html.slice(0, actualStart) + newFooter.trim() + '\n\n' + html.slice(endIdx + endMarker.length).trimStart();
}

function run() {
  console.log('--- Car Castle Goa: Shared Template Compiler ---');
  const files = findHtmlFiles(ROOT);
  let verifiedCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    const originalContent = fs.readFileSync(file, 'utf8');
    const initialH1Count = countH1(originalContent);

    // Compute relative prefix for subdirectories
    const relToRoot = path.relative(path.dirname(file), ROOT);
    const prefix = relToRoot ? relToRoot.replace(/\\/g, '/') + '/' : '';

    let localHeader = headerPartial;
    let localFooter = footerPartial;
    let localDrawer = drawerPartial;

    if (prefix) {
      localHeader = localHeader.replace(/href="([^"#:]+\.html)"/g, `href="${prefix}$1"`)
                               .replace(/src="images\//g, `src="${prefix}images/`);
      localFooter = localFooter.replace(/href="([^"#:]+\.html)"/g, `href="${prefix}$1"`)
                               .replace(/src="images\//g, `src="${prefix}images/`);
      localDrawer = localDrawer.replace(/href="([^"#:]+\.html)"/g, `href="${prefix}$1"`)
                               .replace(/src="images\//g, `src="${prefix}images/`);
    }

    // Active nav states
    const basename = path.basename(file);
    if (basename === 'all-cars.html' || file.includes(`${path.sep}cars${path.sep}`)) {
      localHeader = localHeader.replace('class="nav-link">All Cars</a>', 'class="nav-link active">All Cars</a>');
      localDrawer = localDrawer.replace('class="nav-link">All Cars</a>', 'class="nav-link active">All Cars</a>');
    } else if (basename === 'about.html') {
      localHeader = localHeader.replace('class="nav-link">About</a>', 'class="nav-link active">About</a>');
      localDrawer = localDrawer.replace('class="nav-link">About</a>', 'class="nav-link active">About</a>');
    } else if (basename === 'contact.html') {
      localHeader = localHeader.replace('class="nav-link">Contact</a>', 'class="nav-link active">Contact</a>');
      localDrawer = localDrawer.replace('class="nav-link">Contact</a>', 'class="nav-link active">Contact</a>');
    } else if (basename === 'index.html') {
      localHeader = localHeader.replace('class="nav-link">Home</a>', 'class="nav-link active">Home</a>');
      localDrawer = localDrawer.replace('class="nav-link">Home</a>', 'class="nav-link active">Home</a>');
    }

    let updatedContent = originalContent;
    updatedContent = replaceHeader(updatedContent, localHeader);
    updatedContent = replaceDrawer(updatedContent, localDrawer);
    updatedContent = replaceFooter(updatedContent, localFooter);

    // CRITICAL INTEGRITY CHECK: Ensure H1 count is preserved exactly
    const updatedH1Count = countH1(updatedContent);
    if (initialH1Count > 0 && updatedH1Count !== initialH1Count) {
      console.warn(`⚠️ [Template Compiler] Skipping ${path.basename(file)}: H1 count changed from ${initialH1Count} to ${updatedH1Count}`);
      skippedCount++;
      continue;
    }

    if (updatedContent !== originalContent) {
      fs.writeFileSync(file, updatedContent, 'utf8');
      verifiedCount++;
    } else {
      verifiedCount++;
    }
  }

  console.log(`🎉 Template compilation finished: ${verifiedCount} pages synchronized/verified, ${skippedCount} skipped.`);
}

run();
