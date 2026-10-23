# Contributing to Car Castle Goa

Thank you for contributing to the engineering excellence of the Car Castle Goa platform!

---

## 1. Code of Conduct & Architectural Principles

- **Zero-Bloat Rule:** We prioritize vanilla web standards (HTML5, Vanilla CSS3, ES6 JavaScript) over heavy runtime frameworks to maintain instant page loads (< 1s LCP) and flawless SEO.
- **Accessibility First:** All UI components must meet WCAG 2.1 AA standards, support `prefers-reduced-motion`, and maintain full keyboard navigability.
- **Strict Data Integrity:** The single source of truth for the fleet is `carcastlegoa/data/cars.json`. Always update through the canonical schema.

---

## 2. Development Workflow

```bash
# 1. Install dependencies
npm install

# 2. Start local server with file watch
npm run dev

# 3. Access locally
http://localhost:8080/
http://localhost:8080/admin/
```

---

## 3. Pre-Commit Quality Checklist

Before opening a pull request or pushing to `main`, ensure all quality gates pass:

```bash
# 1. Run unit tests
npm test

# 2. Validate HTML5 & Structured Data Schemas
npm run validate

# 3. Minify and verify production assets
npm run build:assets

# 4. Refresh sitemap
npm run build:sitemap
```

---

## 4. Branching & Commit Conventions

- Use feature branches: `feature/car-detail-enhancement`, `fix/whatsapp-link-encoding`.
- Follow Conventional Commits: `feat:`, `fix:`, `perf:`, `docs:`, `test:`, `refactor:`.
