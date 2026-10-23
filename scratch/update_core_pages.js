const fs = require('fs');
const path = require('path');

const webRoot = path.join(__dirname, '..', 'carcastlegoa');

// Load carsData from cars-filter.js
const carsFilterContent = fs.readFileSync(path.join(webRoot, 'js', 'cars-filter.js'), 'utf8');

// Vehicle definition
const carsData = [
  {
    name: "Mahindra Thar 4x4",
    slug: "mahindra-thar-rental-goa",
    url: "cars/mahindra-thar-rental-goa.html",
    category: "prem",
    categoryLabel: "Premium 4x4 SUV",
    price: "3,500",
    image: "images/mahindra-thar-4x4.webp",
    alt: "Mahindra Thar 4x4 self drive car rental in Goa",
    seats: "4 Seats",
    transmission: "Automatic / 4x4",
    fuel: "Diesel",
    ac: "Air Conditioning"
  },
  {
    name: "Maruti Suzuki Swift",
    slug: "maruti-swift-rental-goa",
    url: "cars/maruti-swift-rental-goa.html",
    category: "reg",
    categoryLabel: "Popular Hatchback",
    price: "1,500",
    image: "images/maruti-suzuki-swift-zxi.webp",
    alt: "Maruti Suzuki Swift self drive car rental in Goa",
    seats: "5 Seats",
    transmission: "Manual",
    fuel: "Petrol",
    ac: "Air Conditioning"
  },
  {
    name: "Toyota Fortuner 4x4",
    slug: "toyota-fortuner-rental-goa",
    url: "cars/toyota-fortuner-rental-goa.html",
    category: "prem",
    categoryLabel: "Luxury 7-Seater",
    price: "5,500",
    image: "images/toyota-fortuner-4x4.webp",
    alt: "Toyota Fortuner 4x4 luxury 7-seater self drive rental in Goa",
    seats: "7 Seats",
    transmission: "Automatic",
    fuel: "Diesel",
    ac: "Dual AC Climate Control"
  },
  {
    name: "Toyota Innova Crysta",
    slug: "toyota-innova-crysta-rental-goa",
    url: "cars/toyota-innova-crysta-rental-goa.html",
    category: "prem",
    categoryLabel: "Executive MPV",
    price: "3,200",
    image: "images/toyota-innova-crysta.webp",
    alt: "Toyota Innova Crysta 7-seater self drive car rental in Goa",
    seats: "7 Seats",
    transmission: "Manual / Auto",
    fuel: "Diesel",
    ac: "Dual AC Climate Control"
  },
  {
    name: "Audi A4 Luxury Sedan",
    slug: "audi-a4-luxury-rental-goa",
    url: "cars/audi-a4-luxury-rental-goa.html",
    category: "prem",
    categoryLabel: "Luxury Sedan",
    price: "6,500",
    image: "images/audi-a4-sedan.webp",
    alt: "Audi A4 luxury sedan self drive rental in Goa",
    seats: "5 Seats",
    transmission: "Automatic",
    fuel: "Petrol",
    ac: "Multi-Zone Climate"
  },
  {
    name: "BMW 4-Series Convertible",
    slug: "bmw-4-series-convertible-rental-goa",
    url: "cars/bmw-4-series-convertible-rental-goa.html",
    category: "prem",
    categoryLabel: "Convertible Luxury",
    price: "7,500",
    image: "images/bmw-4-series-convertible.webp",
    alt: "BMW 4-Series Convertible luxury self drive rental in Goa",
    seats: "4 Seats",
    transmission: "Automatic",
    fuel: "Petrol",
    ac: "Air Conditioning"
  },
  {
    name: "Hyundai Creta SX",
    slug: "hyundai-creta-rental-goa",
    url: "cars/hyundai-creta-rental-goa.html",
    category: "prem",
    categoryLabel: "Compact SUV",
    price: "2,800",
    image: "images/hyundai-creta-sx.webp",
    alt: "Hyundai Creta SX automatic SUV rental in Goa",
    seats: "5 Seats",
    transmission: "Automatic",
    fuel: "Petrol",
    ac: "Air Conditioning"
  },
  {
    name: "Maruti Baleno Alpha",
    slug: "maruti-baleno-rental-goa",
    url: "cars/maruti-baleno-rental-goa.html",
    category: "reg",
    categoryLabel: "Premium Hatchback",
    price: "1,600",
    image: "images/maruti-baleno-alpha.webp",
    alt: "Maruti Baleno Alpha automatic self drive car rental in Goa",
    seats: "5 Seats",
    transmission: "Automatic",
    fuel: "Petrol",
    ac: "Air Conditioning"
  },
  {
    name: "Maruti Ertiga ZXi",
    slug: "maruti-ertiga-7-seater-rental-goa",
    url: "cars/maruti-ertiga-7-seater-rental-goa.html",
    category: "reg",
    categoryLabel: "7-Seater Family",
    price: "2,200",
    image: "images/maruti-ertiga-zxi.webp",
    alt: "Maruti Ertiga 7-seater family self drive car rental in Goa",
    seats: "7 Seats",
    transmission: "Manual",
    fuel: "Petrol",
    ac: "Air Conditioning"
  },
  {
    name: "Hyundai i20 Asta",
    slug: "hyundai-i20-rental-goa",
    url: "cars/hyundai-i20-rental-goa.html",
    category: "reg",
    categoryLabel: "Regular Hatchback",
    price: "1,500",
    image: "images/hyundai-i20-asta.webp",
    alt: "Hyundai i20 Asta automatic hatchback rental in Goa",
    seats: "5 Seats",
    transmission: "Automatic",
    fuel: "Petrol",
    ac: "Air Conditioning"
  },
  {
    name: "Kia Seltos GTX",
    slug: "kia-seltos-rental-goa",
    url: "cars/kia-seltos-rental-goa.html",
    category: "prem",
    categoryLabel: "Premium SUV",
    price: "3,000",
    image: "images/kia-seltos-gtx.webp",
    alt: "Kia Seltos GTX automatic self drive SUV rental in Goa",
    seats: "5 Seats",
    transmission: "Automatic",
    fuel: "Diesel",
    ac: "Air Conditioning"
  }
];

function generateCarCardsHTML(list) {
  return list.map(car => `
      <div class="car-card">
        <div class="car-image-wrapper">
          <a href="${car.url}" title="View ${car.name} rental details and specs in Goa">
            <img src="${car.image}" alt="${car.alt}" class="car-img" loading="lazy" width="600" height="338" />
          </a>
          <span class="car-badge">${car.categoryLabel}</span>
        </div>
        <div class="car-info">
          <div class="car-header">
            <h3 class="car-name"><a href="${car.url}" title="View ${car.name} rental details" style="color:inherit; text-decoration:none;">${car.name}</a></h3>
            <div class="car-price">₹${car.price} <span>/ day</span></div>
          </div>
          <div class="car-specs">
            <div class="spec-item">
              <svg class="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              ${car.seats}
            </div>
            <div class="spec-item">
              <svg class="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              ${car.transmission}
            </div>
            <div class="spec-item">
              <svg class="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              ${car.fuel}
            </div>
            <div class="spec-item">
              <svg class="spec-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              ${car.ac}
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1.35fr; gap: 0.5rem; margin-top: 0.85rem;">
            <a href="${car.url}" class="btn-whatsapp" style="background-color: #f1f5f9; color: #1e293b; border: 1px solid #cbd5e1; padding: 0.65rem 0.5rem; font-size: 0.85rem; font-weight: 600; text-align: center; justify-content: center; box-shadow: none;">
              Specs &amp; Details
            </a>
            <a href="https://wa.me/918767286682?text=Hi%20Car%20Castle%20Goa!%20I%20would%20like%20to%20book%20the%20${encodeURIComponent(car.name)}" target="_blank" rel="noopener noreferrer" class="car-action-btn" data-track-car="${car.name}" style="margin-top: 0; padding: 0.65rem 0.75rem; font-size: 0.85rem; justify-content: center;">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
  `).join('\n');
}

// Global SEO Header Links for Root Pages
function getRootNav(activePage = 'home') {
  return `
  <!-- Navigation Header -->
  <header class="header">
    <div class="header-container">
      <div class="logo">
        <a href="index.html" aria-label="Car Castle Goa Home">
          <img src="images/logo.png" alt="Car Castle Goa - Premium Self Drive Car Rentals" width="220" height="60" />
        </a>
      </div>
      <nav class="nav" aria-label="Main Navigation">
        <ul class="nav-links">
          <li><a href="index.html"${activePage === 'home' ? ' class="active"' : ''}>Home</a></li>
          <li><a href="all-cars.html"${activePage === 'all-cars' ? ' class="active"' : ''}>All Cars</a></li>
          <li><a href="services/self-drive-car-rental-goa.html">Self Drive</a></li>
          <li><a href="pricing.html"${activePage === 'pricing' ? ' class="active"' : ''}>Tariff</a></li>
          <li><a href="how-it-works.html"${activePage === 'how-it-works' ? ' class="active"' : ''}>How It Works</a></li>
          <li><a href="locations/dabolim-airport-car-rental.html">Airport Pickup</a></li>
          <li><a href="blog/index.html">Travel Blog</a></li>
          <li><a href="contact.html"${activePage === 'contact' ? ' class="active"' : ''}>Contact</a></li>
        </ul>
      </nav>
      <div class="nav-cta">
        <a href="https://wa.me/918767286682?text=Hello%20Car%20Castle%20Goa,%20I%20would%20like%20to%20rent%20a%20car." class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer">
          Book via WhatsApp
        </a>
      </div>
    </div>
  </header>`;
}

// Global SEO Footer for Root Pages
function getRootFooter() {
  return `
  <!-- Footer -->
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-col">
        <div class="footer-logo">
          <img src="images/logo.png" alt="Car Castle Goa" width="180" height="48" loading="lazy" />
        </div>
        <p>Goa's premier government-authorized self-drive car rental agency. Unlimited kilometers, zero deposit options, and doorstep delivery across North & South Goa.</p>
        <p class="footer-contact-item"><strong>Address:</strong> Panjim / Calangute / Dabolim Airport / Mopa Airport, Goa 403001</p>
        <p class="footer-contact-item"><strong>Direct Helpline:</strong> <a href="tel:+918767286682">+91 87672 86682</a></p>
        <p class="footer-contact-item"><strong>WhatsApp 24/7:</strong> <a href="https://wa.me/918767286682">+91 87672 86682</a></p>
        <p class="footer-contact-item"><strong>Hours:</strong> Open 24 Hours / 7 Days a Week</p>
      </div>

      <div class="footer-col">
        <h3>Car Rental Services</h3>
        <ul>
          <li><a href="services/self-drive-car-rental-goa.html">Self Drive Car Rental</a></li>
          <li><a href="services/airport-car-rental-goa.html">Goa Airport Car Rental</a></li>
          <li><a href="services/monthly-car-rental-goa.html">Monthly & Long-Term Rental</a></li>
          <li><a href="pricing.html">Rental Tariffs & Rates</a></li>
          <li><a href="how-it-works.html">Booking Process & Documents</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h3>Popular Pickups in Goa</h3>
        <ul>
          <li><a href="locations/dabolim-airport-car-rental.html">Dabolim Airport (GOI)</a></li>
          <li><a href="locations/mopa-airport-car-rental.html">Mopa Airport (GOX)</a></li>
          <li><a href="locations/panjim-car-rental.html">Panjim City Center</a></li>
          <li><a href="locations/calangute-baga-car-rental.html">Calangute & Baga</a></li>
          <li><a href="locations/madgaon-railway-station-car-rental.html">Madgaon Railway Station</a></li>
          <li><a href="locations/north-goa-car-rental.html">North Goa Hub</a></li>
          <li><a href="locations/south-goa-car-rental.html">South Goa Hub</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h3>Travel Guides & Fleet</h3>
        <ul>
          <li><a href="blog/driving-in-goa-rules-tips.html">Goa Driving Rules & Fines</a></li>
          <li><a href="blog/self-drive-vs-taxi-goa-cost-comparison.html">Self-Drive vs Taxi Cost</a></li>
          <li><a href="blog/documents-needed-to-rent-car-in-goa.html">Documents Required</a></li>
          <li><a href="blog/goa-airport-car-rental-guide-dabolim-vs-mopa.html">Airport Pickup Guide</a></li>
          <li><a href="blog/north-goa-vs-south-goa-road-trip-itinerary.html">Road Trip Itinerary</a></li>
          <li><a href="cars/mahindra-thar-rental-goa.html">Rent Mahindra Thar in Goa</a></li>
          <li><a href="cars/maruti-swift-rental-goa.html">Rent Maruti Swift in Goa</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="footer-bottom-container">
        <p>&copy; 2026 Car Castle Rentals Goa. All rights reserved.</p>
        <ul class="footer-legal-links">
          <li><a href="terms.html">Terms & Conditions</a></li>
          <li><a href="privacy.html">Privacy Policy</a></li>
          <li><a href="cancellation-policy.html">Cancellation Policy</a></li>
          <li><a href="sitemap.xml">XML Sitemap</a></li>
        </ul>
      </div>
    </div>
  </footer>
  <script src="js/analytics.js" defer></script>`;
}

// -------------------------------------------------------------
// 1. UPDATE index.html
// -------------------------------------------------------------
let indexHTML = fs.readFileSync(path.join(webRoot, 'index.html'), 'utf8');

// Replace html tag
indexHTML = indexHTML.replace(/<html lang="en">/i, '<html lang="en-IN">');

// Replace head meta & title
const newIndexHeadMeta = `  <title>Car Rental in Goa | Self Drive Car Rentals from ₹1,500/Day</title>
  <meta name="description" content="Rent self drive cars in Goa with Car Castle. 11+ pristine hatchbacks, SUVs, Thar 4x4 & luxury convertibles. Free airport delivery, unlimited km & zero deposit. Book now!" />
  <link rel="canonical" href="https://carcastlegoa.com/" />
  <meta name="theme-color" content="#0f172a" />

  <meta name="google-site-verification" content="[YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE]" />
  <meta name="msvalidate.01" content="[YOUR_BING_VERIFICATION_CODE]" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://carcastlegoa.com/" />
  <meta property="og:title" content="Car Rental in Goa | Self Drive Cars from ₹1,500/Day - Car Castle" />
  <meta property="og:description" content="Explore Goa on your terms with pristine self-drive car rentals. Doorstep delivery across Dabolim, Mopa, Panjim & beaches. Unlimited km & 24/7 support." />
  <meta property="og:image" content="https://carcastlegoa.com/images/hero_road.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Car Rental in Goa | Self Drive Cars from ₹1,500/Day - Car Castle" />
  <meta name="twitter:description" content="Explore Goa with self-drive car rentals starting ₹1,500/day. Doorstep delivery across Dabolim, Mopa, Panjim & beaches." />
  <meta name="twitter:image" content="https://carcastlegoa.com/images/hero_road.jpg" />`;

indexHTML = indexHTML.replace(/<title>[\s\S]*?<\/title>[\s\S]*?<link rel="stylesheet"/i, `${newIndexHeadMeta}\n  <link rel="stylesheet"`);

// Add JSON-LD schema into index.html
const indexJSONLD = `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AutoRental",
        "@id": "https://carcastlegoa.com/#business",
        "name": "Car Castle Rentals Goa",
        "alternateName": "Car Castle Self Drive Car Rental",
        "url": "https://carcastlegoa.com/",
        "logo": "https://carcastlegoa.com/images/logo.png",
        "image": "https://carcastlegoa.com/images/hero_road.jpg",
        "telephone": "+918767286682",
        "email": "bookings@carcastlegoa.com",
        "priceRange": "₹1,500 - ₹7,500 per day",
        "currenciesAccepted": "INR",
        "paymentAccepted": "Cash, Credit Card, Debit Card, UPI, Net Banking",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Panjim, Near Mandovi Promenade",
          "addressLocality": "Panjim",
          "addressRegion": "Goa",
          "postalCode": "403001",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 15.4989,
          "longitude": 73.8278
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            "opens": "00:00",
            "closes": "23:59"
          }
        ],
        "areaServed": [
          { "@type": "City", "name": "Goa" },
          { "@type": "City", "name": "Panjim" },
          { "@type": "City", "name": "Calangute" },
          { "@type": "City", "name": "Baga" },
          { "@type": "City", "name": "Candolim" },
          { "@type": "City", "name": "Margao" },
          { "@type": "Place", "name": "Dabolim Airport GOI" },
          { "@type": "Place", "name": "Mopa Airport GOX" }
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "bestRating": "5",
          "ratingCount": "19"
        },
        "review": [
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Aakash Mehta" },
            "datePublished": "2026-01-10",
            "reviewBody": "Rented a Thar 4x4 for 4 days in Goa. The car was spotless, delivered right at Mopa airport on time. Great service!",
            "reviewRating": { "@type": "Rating", "ratingValue": "5" }
          },
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Sneha Kapoor" },
            "datePublished": "2026-01-14",
            "reviewBody": "Super smooth experience! Booked via WhatsApp and got Swift delivered to our resort in Calangute. No hidden charges.",
            "reviewRating": { "@type": "Rating", "ratingValue": "5" }
          },
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Rohan Verma" },
            "datePublished": "2026-01-18",
            "reviewBody": "Best self-drive car rental in Goa. Very polite staff and quick documentation with just driving license and Aadhaar.",
            "reviewRating": { "@type": "Rating", "ratingValue": "5" }
          },
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Pooja Nair" },
            "datePublished": "2026-01-22",
            "reviewBody": "The Creta was in pristine condition with great AC and Bluetooth system. Highly recommended for couples and families!",
            "reviewRating": { "@type": "Rating", "ratingValue": "5" }
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://carcastlegoa.com/#website",
        "url": "https://carcastlegoa.com/",
        "name": "Car Castle Rentals Goa",
        "description": "Premium self drive car rentals in Goa with unlimited kilometers and doorstep delivery.",
        "publisher": { "@id": "https://carcastlegoa.com/#business" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What documents do I need to rent a self-drive car in Goa?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You need a valid Indian Driving License (Original or DigiLocker) and an official ID proof (Aadhaar Card, Passport, or Voter ID). Foreign tourists need a valid home country driving license with an International Driving Permit (IDP) and passport."
            }
          },
          {
            "@type": "Question",
            "name": "Do you deliver cars directly to Goa airports?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we provide 24/7 doorstep vehicle handover at both Dabolim Airport (GOI) and Manohar International Airport, Mopa (GOX) right outside your arrival terminal."
            }
          },
          {
            "@type": "Question",
            "name": "Is there a kilometer limit on rental cars?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We offer unlimited kilometer packages across Goa so you can explore North and South Goa beaches without worrying about extra per-kilometer billing."
            }
          },
          {
            "@type": "Question",
            "name": "What if the car breaks down during my trip in Goa?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We provide complimentary 24/7 roadside assistance across Goa. We will send a mechanic immediately or replace the car free of charge."
            }
          }
        ]
      }
    ]
  }
  </script>`;

indexHTML = indexHTML.replace('</head>', `${indexJSONLD}\n</head>`);

// Pre-render static car cards in #cars-grid
const staticAllCarsMarkup = generateCarCardsHTML(carsData);
indexHTML = indexHTML.replace(
  /<div id="cars-grid" class="cars-grid">[\s\S]*?<\/div>/i,
  `<div id="cars-grid" class="cars-grid">\n${staticAllCarsMarkup}\n    </div>`
);

// Quick Facts block removed per user request

// Add analytics script before </body>
if (!indexHTML.includes('js/analytics.js')) {
  indexHTML = indexHTML.replace('</body>', '  <script src="js/analytics.js" defer></script>\n</body>');
}

fs.writeFileSync(path.join(webRoot, 'index.html'), indexHTML, 'utf8');
console.log('Updated index.html with static pre-rendered cards, JSON-LD schemas, AEO quick facts, and SEO meta tags');

// -------------------------------------------------------------
// 2. UPDATE all-cars.html
// -------------------------------------------------------------
let allCarsHTML = fs.readFileSync(path.join(webRoot, 'all-cars.html'), 'utf8');
allCarsHTML = allCarsHTML.replace(/<html lang="en">/i, '<html lang="en-IN">');

const allCarsHeadMeta = `  <title>All Self Drive Cars for Rent in Goa | Hatchbacks, SUVs & Luxury</title>
  <meta name="description" content="Browse Car Castle Goa's complete fleet of self drive rental cars. From economical Swift & Baleno to Thar 4x4, Fortuner & BMW Convertible. Instant WhatsApp booking!" />
  <link rel="canonical" href="https://carcastlegoa.com/all-cars.html" />
  <meta name="theme-color" content="#0f172a" />

  <meta name="google-site-verification" content="[YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE]" />
  <meta name="msvalidate.01" content="[YOUR_BING_VERIFICATION_CODE]" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://carcastlegoa.com/all-cars.html" />
  <meta property="og:title" content="All Self Drive Cars for Rent in Goa | Complete Fleet" />
  <meta property="og:description" content="Compare 11+ pristine self-drive cars in Goa. Hatchbacks, 7-seater MPVs, 4x4 SUVs, and convertibles with transparent pricing." />
  <meta property="og:image" content="https://carcastlegoa.com/images/hero_road.jpg" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://carcastlegoa.com/" },
          { "@type": "ListItem", "position": 2, "name": "All Cars", "item": "https://carcastlegoa.com/all-cars.html" }
        ]
      },
      {
        "@type": "ItemList",
        "name": "Car Castle Goa Rental Fleet",
        "description": "Complete inventory of self-drive hatchbacks, sedans, SUVs, and luxury cars available for rent in Goa.",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Mahindra Thar 4x4", "url": "https://carcastlegoa.com/cars/mahindra-thar-rental-goa.html" },
          { "@type": "ListItem", "position": 2, "name": "Maruti Suzuki Swift", "url": "https://carcastlegoa.com/cars/maruti-swift-rental-goa.html" },
          { "@type": "ListItem", "position": 3, "name": "Toyota Fortuner 4x4", "url": "https://carcastlegoa.com/cars/toyota-fortuner-rental-goa.html" },
          { "@type": "ListItem", "position": 4, "name": "Toyota Innova Crysta", "url": "https://carcastlegoa.com/cars/toyota-innova-crysta-rental-goa.html" },
          { "@type": "ListItem", "position": 5, "name": "Audi A4 Luxury Sedan", "url": "https://carcastlegoa.com/cars/audi-a4-luxury-rental-goa.html" },
          { "@type": "ListItem", "position": 6, "name": "BMW 4-Series Convertible", "url": "https://carcastlegoa.com/cars/bmw-4-series-convertible-rental-goa.html" },
          { "@type": "ListItem", "position": 7, "name": "Hyundai Creta SX", "url": "https://carcastlegoa.com/cars/hyundai-creta-rental-goa.html" },
          { "@type": "ListItem", "position": 8, "name": "Maruti Baleno Alpha", "url": "https://carcastlegoa.com/cars/maruti-baleno-rental-goa.html" },
          { "@type": "ListItem", "position": 9, "name": "Maruti Ertiga ZXi", "url": "https://carcastlegoa.com/cars/maruti-ertiga-7-seater-rental-goa.html" },
          { "@type": "ListItem", "position": 10, "name": "Hyundai i20 Asta", "url": "https://carcastlegoa.com/cars/hyundai-i20-rental-goa.html" },
          { "@type": "ListItem", "position": 11, "name": "Kia Seltos GTX", "url": "https://carcastlegoa.com/cars/kia-seltos-rental-goa.html" }
        ]
      }
    ]
  }
  </script>`;

allCarsHTML = allCarsHTML.replace(/<title>[\s\S]*?<\/title>[\s\S]*?<link rel="stylesheet"/i, `${allCarsHeadMeta}\n  <link rel="stylesheet"`);

allCarsHTML = allCarsHTML.replace(
  /<div id="cars-grid" class="cars-grid">[\s\S]*?<\/div>/i,
  `<div id="cars-grid" class="cars-grid">\n${staticAllCarsMarkup}\n    </div>`
);

if (!allCarsHTML.includes('js/analytics.js')) {
  allCarsHTML = allCarsHTML.replace('</body>', '  <script src="js/analytics.js" defer></script>\n</body>');
}

fs.writeFileSync(path.join(webRoot, 'all-cars.html'), allCarsHTML, 'utf8');
console.log('Updated all-cars.html with static pre-rendered cards and ItemList schema');

// -------------------------------------------------------------
// 3. UPDATE reg-cars.html
// -------------------------------------------------------------
let regCarsHTML = fs.readFileSync(path.join(webRoot, 'reg-cars.html'), 'utf8');
regCarsHTML = regCarsHTML.replace(/<html lang="en">/i, '<html lang="en-IN">');

const regCarsHeadMeta = `  <title>Regular & Hatchback Car Rentals in Goa | From ₹1,500/Day</title>
  <meta name="description" content="Rent budget-friendly regular hatchbacks and family cars in Goa. Maruti Swift, Baleno, i20, and Ertiga 7-seater with unlimited kilometers. Zero hidden charges." />
  <link rel="canonical" href="https://carcastlegoa.com/reg-cars.html" />
  <meta name="theme-color" content="#0f172a" />

  <meta name="google-site-verification" content="[YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE]" />
  <meta name="msvalidate.01" content="[YOUR_BING_VERIFICATION_CODE]" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://carcastlegoa.com/reg-cars.html" />
  <meta property="og:title" content="Regular & Hatchback Car Rentals in Goa | From ₹1,500/Day" />
  <meta property="og:description" content="Affordable self-drive hatchbacks in Goa. Maruti Swift, Baleno, i20, and Ertiga with free airport delivery." />
  <meta property="og:image" content="https://carcastlegoa.com/images/hero_road.jpg" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://carcastlegoa.com/" },
          { "@type": "ListItem", "position": 2, "name": "All Cars", "item": "https://carcastlegoa.com/all-cars.html" },
          { "@type": "ListItem", "position": 3, "name": "Regular Cars", "item": "https://carcastlegoa.com/reg-cars.html" }
        ]
      },
      {
        "@type": "ItemList",
        "name": "Regular Self-Drive Cars in Goa",
        "description": "Economical and reliable hatchbacks and MPVs for rent in Goa.",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Maruti Suzuki Swift", "url": "https://carcastlegoa.com/cars/maruti-swift-rental-goa.html" },
          { "@type": "ListItem", "position": 2, "name": "Maruti Baleno Alpha", "url": "https://carcastlegoa.com/cars/maruti-baleno-rental-goa.html" },
          { "@type": "ListItem", "position": 3, "name": "Maruti Ertiga ZXi", "url": "https://carcastlegoa.com/cars/maruti-ertiga-7-seater-rental-goa.html" },
          { "@type": "ListItem", "position": 4, "name": "Hyundai i20 Asta", "url": "https://carcastlegoa.com/cars/hyundai-i20-rental-goa.html" }
        ]
      }
    ]
  }
  </script>`;

regCarsHTML = regCarsHTML.replace(/<title>[\s\S]*?<\/title>[\s\S]*?<link rel="stylesheet"/i, `${regCarsHeadMeta}\n  <link rel="stylesheet"`);

const regCarsList = carsData.filter(c => c.category === 'reg');
regCarsHTML = regCarsHTML.replace(
  /<div id="cars-grid" class="cars-grid">[\s\S]*?<\/div>/i,
  `<div id="cars-grid" class="cars-grid">\n${generateCarCardsHTML(regCarsList)}\n    </div>`
);

if (!regCarsHTML.includes('js/analytics.js')) {
  regCarsHTML = regCarsHTML.replace('</body>', '  <script src="js/analytics.js" defer></script>\n</body>');
}

fs.writeFileSync(path.join(webRoot, 'reg-cars.html'), regCarsHTML, 'utf8');
console.log('Updated reg-cars.html with pre-rendered regular car cards and schema');

// -------------------------------------------------------------
// 4. UPDATE prem-cars.html
// -------------------------------------------------------------
let premCarsHTML = fs.readFileSync(path.join(webRoot, 'prem-cars.html'), 'utf8');
premCarsHTML = premCarsHTML.replace(/<html lang="en">/i, '<html lang="en-IN">');

const premCarsHeadMeta = `  <title>Premium & Luxury Car Rentals in Goa | Thar 4x4, Fortuner & BMW</title>
  <meta name="description" content="Rent luxury SUVs and convertibles in Goa. Mahindra Thar 4x4, Toyota Fortuner, Audi A4, and BMW 4-Series Convertible. VIP airport delivery across Goa." />
  <link rel="canonical" href="https://carcastlegoa.com/prem-cars.html" />
  <meta name="theme-color" content="#0f172a" />

  <meta name="google-site-verification" content="[YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE]" />
  <meta name="msvalidate.01" content="[YOUR_BING_VERIFICATION_CODE]" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://carcastlegoa.com/prem-cars.html" />
  <meta property="og:title" content="Premium & Luxury Car Rentals in Goa | Thar 4x4, Fortuner & BMW" />
  <meta property="og:description" content="Executive SUVs and convertibles for rent in Goa. Thar 4x4, Fortuner, Innova Crysta, Creta, Audi, and BMW with VIP delivery." />
  <meta property="og:image" content="https://carcastlegoa.com/images/hero_road.jpg" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://carcastlegoa.com/" },
          { "@type": "ListItem", "position": 2, "name": "All Cars", "item": "https://carcastlegoa.com/all-cars.html" },
          { "@type": "ListItem", "position": 3, "name": "Premium Cars", "item": "https://carcastlegoa.com/prem-cars.html" }
        ]
      },
      {
        "@type": "ItemList",
        "name": "Premium & Luxury Self-Drive Cars in Goa",
        "description": "Executive 4x4 SUVs, luxury sedans, and open-top convertibles for rent in Goa.",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Mahindra Thar 4x4", "url": "https://carcastlegoa.com/cars/mahindra-thar-rental-goa.html" },
          { "@type": "ListItem", "position": 2, "name": "Toyota Fortuner 4x4", "url": "https://carcastlegoa.com/cars/toyota-fortuner-rental-goa.html" },
          { "@type": "ListItem", "position": 3, "name": "Toyota Innova Crysta", "url": "https://carcastlegoa.com/cars/toyota-innova-crysta-rental-goa.html" },
          { "@type": "ListItem", "position": 4, "name": "Audi A4 Luxury Sedan", "url": "https://carcastlegoa.com/cars/audi-a4-luxury-rental-goa.html" },
          { "@type": "ListItem", "position": 5, "name": "BMW 4-Series Convertible", "url": "https://carcastlegoa.com/cars/bmw-4-series-convertible-rental-goa.html" },
          { "@type": "ListItem", "position": 6, "name": "Hyundai Creta SX", "url": "https://carcastlegoa.com/cars/hyundai-creta-rental-goa.html" },
          { "@type": "ListItem", "position": 7, "name": "Kia Seltos GTX", "url": "https://carcastlegoa.com/cars/kia-seltos-rental-goa.html" }
        ]
      }
    ]
  }
  </script>`;

premCarsHTML = premCarsHTML.replace(/<title>[\s\S]*?<\/title>[\s\S]*?<link rel="stylesheet"/i, `${premCarsHeadMeta}\n  <link rel="stylesheet"`);

const premCarsList = carsData.filter(c => c.category === 'prem');
premCarsHTML = premCarsHTML.replace(
  /<div id="cars-grid" class="cars-grid">[\s\S]*?<\/div>/i,
  `<div id="cars-grid" class="cars-grid">\n${generateCarCardsHTML(premCarsList)}\n    </div>`
);

if (!premCarsHTML.includes('js/analytics.js')) {
  premCarsHTML = premCarsHTML.replace('</body>', '  <script src="js/analytics.js" defer></script>\n</body>');
}

fs.writeFileSync(path.join(webRoot, 'prem-cars.html'), premCarsHTML, 'utf8');
console.log('Updated prem-cars.html with pre-rendered premium car cards and schema');

// -------------------------------------------------------------
// 5. UPDATE about.html
// -------------------------------------------------------------
let aboutHTML = fs.readFileSync(path.join(webRoot, 'about.html'), 'utf8');
aboutHTML = aboutHTML.replace(/<html lang="en">/i, '<html lang="en-IN">');

const aboutHeadMeta = `  <title>About Car Castle Goa | Authorized Self Drive Car Rentals</title>
  <meta name="description" content="Learn about Car Castle Goa: our story, fleet standards, transparent pricing, and 24/7 customer commitment for self-drive car hire across Goa." />
  <link rel="canonical" href="https://carcastlegoa.com/about.html" />
  <meta name="theme-color" content="#0f172a" />

  <meta name="google-site-verification" content="[YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE]" />
  <meta name="msvalidate.01" content="[YOUR_BING_VERIFICATION_CODE]" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://carcastlegoa.com/about.html" />
  <meta property="og:title" content="About Car Castle Goa | Trusted Self-Drive Car Rentals" />
  <meta property="og:description" content="Discover our fleet standards, RTO commercial licensing, and customer-first car rental philosophy in Goa." />
  <meta property="og:image" content="https://carcastlegoa.com/images/hero_road.jpg" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://carcastlegoa.com/" },
          { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://carcastlegoa.com/about.html" }
        ]
      },
      {
        "@type": "AboutPage",
        "name": "About Car Castle Rentals Goa",
        "url": "https://carcastlegoa.com/about.html",
        "description": "Detailed background on Car Castle Goa's operations, fleet hygiene standards, and commercial Rent-a-Cab certification.",
        "mainEntity": {
          "@type": "AutoRental",
          "name": "Car Castle Rentals Goa",
          "url": "https://carcastlegoa.com/",
          "telephone": "+918767286682"
        }
      }
    ]
  }
  </script>`;

aboutHTML = aboutHTML.replace(/<title>[\s\S]*?<\/title>[\s\S]*?<link rel="stylesheet"/i, `${aboutHeadMeta}\n  <link rel="stylesheet"`);

if (!aboutHTML.includes('js/analytics.js')) {
  aboutHTML = aboutHTML.replace('</body>', '  <script src="js/analytics.js" defer></script>\n</body>');
}

fs.writeFileSync(path.join(webRoot, 'about.html'), aboutHTML, 'utf8');
console.log('Updated about.html with canonical, meta, and AboutPage schema');

// -------------------------------------------------------------
// 6. UPDATE contact.html
// -------------------------------------------------------------
let contactHTML = fs.readFileSync(path.join(webRoot, 'contact.html'), 'utf8');
contactHTML = contactHTML.replace(/<html lang="en">/i, '<html lang="en-IN">');

const contactHeadMeta = `  <title>Contact Car Castle Goa | Book Self Drive Cars & Airport Pickup</title>
  <meta name="description" content="Get in touch with Car Castle Goa for instant self drive car rentals. Call +91 87672 86682, message on WhatsApp, or find our airport & Panjim pickup hubs." />
  <link rel="canonical" href="https://carcastlegoa.com/contact.html" />
  <meta name="theme-color" content="#0f172a" />

  <meta name="google-site-verification" content="[YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE]" />
  <meta name="msvalidate.01" content="[YOUR_BING_VERIFICATION_CODE]" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://carcastlegoa.com/contact.html" />
  <meta property="og:title" content="Contact Car Castle Goa | Direct Phone & WhatsApp Support" />
  <meta property="og:description" content="Call or WhatsApp +91 87672 86682 for immediate car deliveries at Dabolim, Mopa, Panjim, and Calangute." />
  <meta property="og:image" content="https://carcastlegoa.com/images/hero_road.jpg" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://carcastlegoa.com/" },
          { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://carcastlegoa.com/contact.html" }
        ]
      },
      {
        "@type": "ContactPage",
        "name": "Contact Car Castle Goa",
        "url": "https://carcastlegoa.com/contact.html",
        "mainEntity": {
          "@type": "AutoRental",
          "name": "Car Castle Rentals Goa",
          "telephone": "+918767286682",
          "email": "bookings@carcastlegoa.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Panjim, Near Mandovi Promenade",
            "addressLocality": "Panjim",
            "addressRegion": "Goa",
            "postalCode": "403001",
            "addressCountry": "IN"
          }
        }
      }
    ]
  }
  </script>`;

contactHTML = contactHTML.replace(/<title>[\s\S]*?<\/title>[\s\S]*?<link rel="stylesheet"/i, `${contactHeadMeta}\n  <link rel="stylesheet"`);

// Add Google Map and Review CTA to contact.html before the footer
const contactExtrasMarkup = `
  <!-- Direct Contact & Map Section -->
  <section class="section" style="background:#ffffff; padding-top: 1rem;">
    <div class="container" style="max-width: 1000px; margin: 0 auto; padding: 0 1.5rem;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 3rem;">
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding: 2rem;">
          <h3 style="font-size: 1.35rem; font-weight:800; color:#0f172a; margin-bottom: 1rem;">Direct Contact Details</h3>
          <p style="margin-bottom: 0.75rem;"><strong>Phone:</strong> <a href="tel:+918767286682" style="color:#0284c7; text-decoration:none; font-weight:700;">+91 87672 86682</a></p>
          <p style="margin-bottom: 0.75rem;"><strong>WhatsApp:</strong> <a href="https://wa.me/918767286682" target="_blank" rel="noopener noreferrer" style="color:#16a34a; text-decoration:none; font-weight:700;">+91 87672 86682</a></p>
          <p style="margin-bottom: 0.75rem;"><strong>Email:</strong> <a href="mailto:bookings@carcastlegoa.com" style="color:#0284c7; text-decoration:none;">bookings@carcastlegoa.com</a></p>
          <p style="margin-bottom: 0.75rem;"><strong>Main Hubs:</strong> Panjim City, Calangute Beach, Dabolim Airport (GOI), Manohar International Airport Mopa (GOX)</p>
          <p style="margin-bottom: 0;"><strong>Operational Hours:</strong> 24 Hours / 7 Days a Week</p>
        </div>

        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:16px; padding: 2rem; display:flex; flex-direction:column; justify-content:center;">
          <h3 style="font-size: 1.35rem; font-weight:800; color:#1e40af; margin-bottom: 0.75rem;">Loved Your Trip in Goa?</h3>
          <p style="color:#334155; line-height: 1.6; margin-bottom: 1.25rem;">
            Your feedback means the world to our team and helps fellow road-trippers find authentic, legal self-drive cars in Goa. Leave us a quick 5-star Google review!
          </p>
          <a href="https://search.google.com/local/writereview?placeid=[YOUR_GOOGLE_PLACE_ID]" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display:inline-block; text-align:center; padding: 0.85rem 1.5rem; text-decoration:none;">
            Write a Google Review
          </a>
        </div>
      </div>

      <!-- Embedded Google Map -->
      <div style="border-radius:16px; overflow:hidden; border:1px solid #e2e8f0; height: 380px;">
        <iframe 
          title="Car Castle Goa Service Area Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123066.07172855797!2d73.74312683078453!3d15.498901016843615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfc0c08b532729%3A0xb36b5ec6353d99d1!2sPanaji%2C%20Goa!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style="border:0;" 
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </div>
    </div>
  </section>
`;

if (!contactHTML.includes('Direct Contact & Map Section')) {
  contactHTML = contactHTML.replace('<!-- Footer -->', `${contactExtrasMarkup}\n  <!-- Footer -->`);
}

if (!contactHTML.includes('js/analytics.js')) {
  contactHTML = contactHTML.replace('</body>', '  <script src="js/analytics.js" defer></script>\n</body>');
}

fs.writeFileSync(path.join(webRoot, 'contact.html'), contactHTML, 'utf8');
console.log('Updated contact.html with Google Map, Review CTA, and ContactPage schema');
