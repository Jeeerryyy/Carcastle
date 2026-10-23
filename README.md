# Car Castle Goa — Self-Drive Car Rental Platform & Admin Suite

Production-grade web application and business administration platform for **Car Castle Goa**, a government-authorized self-drive car rental agency serving North Goa, South Goa, Dabolim Airport (GOI), and Mopa Airport (GOX).

---

## 1. System Architecture

The project is structured with a zero-bloat, high-performance static architecture with progressive client-side enhancement:

```
CCGoa/
├── carcastlegoa/                 # Production website root
│   ├── index.html                # Home landing page (Hero, Fleet showcase, Why Choose Us, FAQs)
│   ├── all-cars.html             # Complete fleet catalog with real-time filtering
│   ├── prem-cars.html            # Premium & luxury fleet showcase
│   ├── reg-cars.html             # Economy & regular fleet showcase
│   ├── pricing.html              # Transparent rate cards & deposit terms
│   ├── about.html                # Agency credentials & fleet standards
│   ├── contact.html              # Direct reservation & location map
│   ├── how-it-works.html         # Rental procedure & required documents
│   ├── cars/                     # 11 vehicle detail landing pages (SEO optimized)
│   ├── locations/                # 7 localized airport & destination landing pages
│   ├── services/                 # 3 service-specific landing pages
│   ├── blog/                     # 8 Goa driving & travel guides
│   ├── css/
│   │   └── styles.css            # Responsive design system & skeleton loader tokens
│   ├── js/
│   │   ├── main.js               # Mobile navigation drawer & FAQ accordion
│   │   ├── cars-filter.js        # Dynamic fleet search, filter tabs, & WhatsApp booking generator
│   │   └── analytics.js          # Google Analytics & event measurement
│   ├── images/                   # Photorealistic vehicle webp assets, icons & favicons
│   └── admin/                    # Admin Management Suite
│       ├── index.html            # Single-screen management console (Dashboard, All Cars, Add Car)
│       ├── login.html            # Authenticated owner login portal
│       ├── firestore.rules       # Security rules for Cloud Firestore
│       ├── css/
│       │   └── admin.css         # Flat, utilitarian business software styling & skeleton animations
│       └── js/
│           ├── admin.js          # Core controller, view router, form validation, filter state
│           ├── ui.js             # UI renderers, skeleton builders, toast notifications
│           ├── db.js             # LocalStorage offline-first cache + lazy Firestore cloud sync
│           ├── auth.js           # Session auth manager + lazy Firebase Auth adapter
│           └── firebase-config.js# Dynamic credentials loader & Cloudinary image uploader
├── server.js                     # Native Node.js static HTTP server with clean URL support
└── scratch/                      # Automated validation & test scripts
```

---

## 2. Key Features

### Public Website
- **Zero-Latency Static Pre-Rendering**: Pre-rendered HTML cards for instant first paint and 100% crawlability by search engine spiders.
- **Dynamic Search & Filtering**: Client-side filtering by category (All, Regular, Premium) and date/time duration calculator without page reload.
- **Direct-to-WhatsApp Booking**: Automated reservation payload generator pre-filling pickup location, dates, and selected vehicle details.
- **AEO / GEO / Local SEO Optimization**: 43 semantic HTML5 pages equipped with schema.org `AutoRental`, `Product`, `FAQPage`, and `BreadcrumbList` JSON-LD microdata.
- **Design-Consistent Skeletons**: Built-in shimmer skeleton placeholders (`.skeleton-card`) with matching 200px image containers ensuring zero cumulative layout shift (CLS = 0).

### Admin Suite (`/admin`)
- **Dashboard**: Real-time KPI summary (Total Cars, Available, Booked, Under Maintenance) and Recently Added vehicles list with click-to-edit.
- **All Cars Fleet Table**: Sortable fleet view with real-time text search, status dropdown filtering, instant availability toggle switch, edit form navigation, and delete confirmation.
- **Add New Car / Edit Car Shared Form**: Unified vehicle editor with required field validation, category assignments, daily rate calculation, and Cloudinary image upload.
- **Offline-First Resilience**: Full functionality in offline/demo mode backed by `localStorage` and a built-in 11-vehicle seed fleet, with non-blocking background synchronization to Firebase Firestore when credentials are configured.

---

## 3. Running Locally

### Prerequisites
- Node.js (version 18+ recommended)

### Start Development Server
```bash
node server.js
```
The server will start at:
- **Public Site**: [http://localhost:8080/](http://localhost:8080/)
- **Admin Panel**: [http://localhost:8080/admin/](http://localhost:8080/admin/)
- **Admin Login**: [http://localhost:8080/admin/login.html](http://localhost:8080/admin/login.html)

---

## 4. Quality & SEO Validation

Run the automated integrity test suite:
```bash
node scratch/validate_site.js
```
Validates:
- Correct language declaration on all 43 HTML documents.
- Proper viewport configuration.
- Unique page titles and meta descriptions.
- Single `<h1>` tag per page.
- Image `alt` tags across all components.
- JSON-LD syntax validity.
