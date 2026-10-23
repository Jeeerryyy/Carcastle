# Changelog

All notable changes to the Car Castle Goa codebase are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-23

### Added
- **Security Hardening:** Enforced admin-UID validation and schema integrity in `firestore.rules`.
- **Content-Security-Policy:** Full CSP headers on server response restricting untrusted origins.
- **Asynchronous I/O & Rate Limiting:** Non-blocking async file streaming and sliding-window rate limiter (180 req/min) in `server.js`.
- **Health Probes:** Added `/health` and `/status` observability endpoints.
- **Image Optimization:** Converted heavy PNG/JPEG assets to WebP, saving 3.47 MB of bandwidth.
- **LCP Hero Preloading:** Added `fetchpriority="high"` and `<link rel="preload">` for instantaneous hero image rendering.
- **Accessibility:** Added Skip-to-content links, WCAG 2.1 AA text contrast, `prefers-reduced-motion` support, and keyboard-accessible FAQ accordions.
- **Date Validation:** Added pickup/drop-off date constraints preventing past bookings and reversed date ranges.
- **DevOps & Build Automation:** Added root `package.json`, `.env.example`, `.env`, `Dockerfile`, `docker-compose.yml`, and GitHub Actions CI workflow (`ci.yml`).
- **Canonical Fleet Schema:** Consolidated fleet data into `carcastlegoa/data/cars.json`.
- **Reusable Partials:** Added `templates/partials/` and `compile-templates.js` for zero-redundancy navigation and footer management.
- **Icon Sprite Sheet:** Created `carcastlegoa/images/icons.svg` consolidating repetitive inline SVG code.
- **Unit & E2E Testing:** Created comprehensive Node.js test suite (`node:test`) and Playwright-compatible headless browser integration tests.
- **SEO Key Manager:** Added `scripts/apply-seo-keys.js` for 1-click injection of Google Search Console, Bing, and GA4 keys.
- **Complete Documentation:** Authored `DEPLOYMENT.md`, `docs/ARCHITECTURE.md`, `CONTRIBUTING.md`, and `CHANGELOG.md`.

### Fixed
- **WhatsApp Encoding Bug:** Fixed mixed `%0A` string concatenation with proper uniform `encodeURIComponent` formatting across all browsers.
- **CategoryGroup Logic:** Fixed Sedan and affordable cars incorrectly classified as premium in `admin.js`.
- **Demo Mode Bypass:** Gated demo mode auto-login in production to prevent unauthorized administrative dashboard access.
- **Google Fonts Blocking:** Replaced render-blocking `@import` with modern preconnect links.
