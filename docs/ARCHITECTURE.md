# System Architecture & Technical Specifications
## Car Castle Goa — Self-Drive Car Rental Platform

---

## 1. System Overview

Car Castle Goa is engineered for high reliability, minimal maintenance, and maximum page speed. It utilizes a decoupled architecture:

```mermaid
graph TD
    User["Web Visitor / Renter"] -->|HTTP / HTTPS| Server["Node.js Server / CDN"]
    Server -->|Static HTML5/CSS3| PublicSite["Public Surface (43 Pages)"]
    PublicSite -->|WhatsApp API| Booking["Direct WhatsApp Booking Flow"]
    PublicSite -->|Read Fleet| Firestore["Cloud Firestore (cars collection)"]
    
    Admin["Shop Owner / Admin"] -->|Login / Auth| AdminSPA["Admin Panel SPA"]
    AdminSPA -->|CRUD Writes (Admin Only)| Firestore
    AdminSPA -->|Photos Upload| Cloudinary["Cloudinary CDN"]
    Firestore -->|Realtime onSnapshot| PublicSite
```

---

## 2. Directory Structure & Separation of Concerns

```
CCGoa/
├── carcastlegoa/               # Primary Web Root
│   ├── index.html              # Homepage & Hero Search
│   ├── all-cars.html           # Full Fleet Listing
│   ├── reg-cars.html           # Regular Hatchback / Compact Fleet
│   ├── prem-cars.html          # Premium SUV & Luxury Convertible Fleet
│   ├── cars/                   # 11 Dedicated Car Detail Pages
│   ├── locations/              # 7 Strategic Goa Location Landing Pages
│   ├── services/               # 3 Service Guides (Airport, Doorstep, Corporate)
│   ├── blog/                   # 8 SEO In-depth Articles + Blog Index
│   ├── css/                    # styles.css, styles.min.css
│   ├── js/                     # main.js, cars-filter.js, analytics.js
│   ├── images/                 # Optimized WebP Fleet Photography & Icons
│   ├── data/                   # cars.json (Single Source of Truth)
│   └── admin/                  # Secure Single-Page Admin Application
│       ├── index.html          # Admin Dashboard & Fleet Manager
│       ├── login.html          # Admin Authentication Portal
│       ├── firestore.rules     # Role-Based Cloud Access Rules
│       ├── css/                # admin.css, admin.min.css
│       └── js/                 # Modular ES6 Admin Controllers
├── config/                     # Environment configuration loader
├── scripts/                    # Build, Minification, Sitemap, & SEO Tools
├── templates/                  # Shared Partials (header, footer, drawer)
├── tests/                      # Unit & E2E Integration Test Suites
├── Dockerfile                  # Production container definition
├── docker-compose.yml          # Local container orchestration
├── server.js                   # High-throughput asynchronous server
└── package.json                # Project descriptor & CLI commands
```

---

## 3. Data Dictionary: Canonical Fleet Record (`cars.json`)

Each vehicle in the fleet conforms to the following strict schema:

| Property | Type | Description | Example |
|---|---|---|---|
| `id` | number / string | Unique identifier | `1` or `"mahindra-thar"` |
| `name` | string | Full display name | `"Mahindra Thar 4x4"` |
| `brand` | string | Manufacturer brand | `"Mahindra"` |
| `slug` | string | URL-safe identifier | `"mahindra-thar-rental-goa"` |
| `url` | string | Relative canonical link | `"cars/mahindra-thar-rental-goa.html"` |
| `category` | string | Fleet bucket (`reg` or `prem`) | `"prem"` |
| `categoryType` | string | Body style | `"SUV"` |
| `categoryLabel` | string | Marketing label | `"Premium 4x4 SUV"` |
| `pricePerDay` | number | Daily rental price in INR | `3500` |
| `pricePerHour` | number | Overtime hourly rate in INR | `200` |
| `price` | string | Localized display price | `"3,500"` |
| `image` | string | WebP primary display photo | `"images/mahindra-thar-4x4.webp"` |
| `seats` | string | Passenger capacity | `"4 Seats"` |
| `transmission` | string | Transmission type | `"Automatic / 4x4"` |
| `fuel` | string | Fuel requirements | `"Diesel"` |
| `ac` | string | Climate control details | `"Air Conditioning"` |
| `features` | array | Core highlight tags | `["4x4 Drive", "Hard Top"]` |

---

## 4. Security Architecture

1. **Firestore Role-Based Security:**
   - Public read access is permitted on `/cars/{carId}` so visitors receive realtime updates.
   - All write operations (create, update, delete) require admin verification (`isAdmin()`).
   - `/settings/{settingId}` is locked down exclusively to authenticated admins.

2. **Server-Side Content-Security-Policy (CSP):**
   - Enforced by `server.js` on every HTTP response.
   - Disallows unauthorized inline frames and untrusted script execution.
   - Strictly permits whitelisted CDNs: Google Fonts, Firebase SDK (`www.gstatic.com`), Cloudinary, Google Analytics.

3. **In-Memory Rate Limiting:**
   - 180 requests/minute per client IP sliding window.
   - Prevents web scraping, brute-force admin attacks, and denial of service.

4. **Input Sanitization & Output Escaping:**
   - All user-supplied inputs in the admin dashboard pass through `escapeHTML()`.
   - Slugs are sanitized to `[a-z0-9-]` to eliminate path traversal vulnerabilities.
