# Production Deployment Guide
## Car Castle Goa — Self-Drive Car Rentals

This guide provides end-to-end instructions for deploying Car Castle Goa to various production cloud hosting platforms.

---

## 1. Hosting Architecture Overview

Car Castle Goa is designed as an ultra-high-performance hybrid application:
- **Public Website:** Static HTML5 + Vanilla CSS3 + Modern ES6 JavaScript. Can be deployed to any static CDN (Cloudflare Pages, Vercel, Netlify, Firebase Hosting) or served via the production Node.js server.
- **Admin Panel:** Client-side SPA backed by Firebase Authentication and Cloud Firestore for realtime fleet synchronization.
- **Server:** Minimal, high-throughput Node.js HTTP server (`server.js`) with Content-Security-Policy (CSP), sliding-window rate limiting, and health check probes.

---

## 2. Option A: Containerized Docker / VPS Deployment (Recommended)

### Prerequisites
- Linux Server (Ubuntu 22.04 LTS / Debian 12) with Docker & Docker Compose installed.
- Domain pointing to your VPS IP address (e.g., `carcastlegoa.com` -> `A 1.2.3.4`).

### Quick Start
```bash
# 1. Clone repository
git clone https://github.com/your-username/CCGoa.git
cd CCGoa

# 2. Setup environment variables
cp .env.example .env
nano .env  # Enter your Firebase and SEO keys

# 3. Build and launch with Docker Compose
docker compose up -d --build

# 4. Verify container health
curl http://localhost:8080/health
```

### Nginx Reverse Proxy with SSL (Certbot)
Configure Nginx (`/etc/nginx/sites-available/carcastlegoa.conf`):
```nginx
server {
    server_name carcastlegoa.com www.carcastlegoa.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Obtain free SSL certificates:
```bash
sudo certbot --nginx -d carcastlegoa.com -d www.carcastlegoa.com
```

---

## 3. Option B: Static CDN Deployment (Firebase Hosting / Vercel / Netlify)

### Firebase Hosting
```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login and initialize
firebase login
firebase init hosting
# Set public directory to: carcastlegoa

# 3. Deploy
firebase deploy --only hosting
```

### Vercel + Supabase (Recommended Production Stack)
1. Execute `schema.sql` in your Supabase SQL Editor.
2. Import repository on [Vercel Dashboard](https://vercel.com).
3. Add Environment Variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_UPLOAD_PRESET`.
4. Deploy with 1 click.
5. See [VERCEL_SUPABASE_DEPLOYMENT.md](VERCEL_SUPABASE_DEPLOYMENT.md) for full detailed guide.

---

## 4. Environment Variables Reference

| Variable | Description | Example |
|---|---|---|
| `SUPABASE_URL` | Supabase Project URL | `https://your-project.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase Public `anon` Key | `eyJhbGciOiJIUz...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Admin Key (Optional) | `eyJhbGciOiJIUz...` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name for photos | `carcastlegoa` |
| `CLOUDINARY_UPLOAD_PRESET` | Cloudinary Unsigned Upload Preset | `carcastle_unsigned` |
| `PORT` | HTTP Port for local Node.js server | `8080` |
| `NODE_ENV` | Runtime environment | `production` |
| `GOOGLE_SEARCH_CONSOLE_CODE` | GSC Verification Token | `google12345.html` |
| `GA4_MEASUREMENT_ID` | Google Analytics 4 Measurement ID | `G-XXXXXXXXXX` |

---

## 5. Post-Deployment Verification Checklist

1. **Health Check:** `curl -I https://carcastlegoa.com/health` returns `200 OK`.
2. **Security Headers:** Verify `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, and `X-Frame-Options: SAMEORIGIN`.
3. **SEO & Sitemap:** Validate `https://carcastlegoa.com/sitemap.xml` and `robots.txt`.
4. **Admin Panel Access:** Verify `https://carcastlegoa.com/admin/login.html` enforces authentication.
