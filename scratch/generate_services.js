const fs = require('fs');
const path = require('path');

const services = [
  {
    title: "Self Drive Car Rental in Goa | Best Rates from ₹1,500/Day",
    description: "Book verified self drive cars in Goa from ₹1,500/day. Doorstep delivery at Dabolim & Mopa airports, hotels & resorts. Unlimited kms, instant WhatsApp booking!",
    slug: "self-drive-car-rental-goa",
    filename: "self-drive-car-rental-goa.html",
    h1: "Self Drive Car Rental Service Across Goa",
    subtitle: "Explore Goa on your own schedule with certified, sanitized cars, unlimited kilometers, and zero hidden charges.",
    serviceType: "SelfDriveCarRental",
    summary: {
      rate: "Starting ₹1,500 / 24 Hours",
      kilometers: "Unlimited inside Goa",
      handover: "Doorstep, Hotel & Airport Delivery",
      deposit: "Refundable ₹0 to ₹3,000",
      docs: "Original Driving License + Aadhaar/Passport",
      support: "24/7 Roadside Assistance & Car Swap"
    },
    contentHtml: `
      <h2>Why Choose Self Drive Over Taxis in Goa?</h2>
      <p>Taxis in Goa are notoriously expensive and lack transparent meter pricing. A single one-way trip from Mopa Airport to South Goa can cost up to ₹3,000 to ₹4,000. Renting a self-drive car from <strong>Car Castle Goa</strong> gives you an entire 24 hours of unlimited travel starting from just <strong>₹1,500/day</strong>.</p>
      
      <p>Whether you are planning a beach-hopping tour across North Goa (Anjuna, Vagator, Ashwem, Morjim) or cruising down scenic coastal roads to South Goa (Colva, Benaulim, Cabo de Rama, Palolem), having your own car offers total privacy, convenience for luggage, and freedom from bargaining.</p>

      <h2>Our Simple 4-Step Self-Drive Rental Process</h2>
      <ul>
        <li><strong>Step 1: Choose Your Vehicle</strong> &mdash; Browse our regular hatchbacks, premium SUVs, 7-seater MPVs, or open-top convertibles.</li>
        <li><strong>Step 2: WhatsApp Confirmation</strong> &mdash; Send your arrival dates and pickup spot. We confirm your car instantly without complicated advance paperwork.</li>
        <li><strong>Step 3: Doorstep Vehicle Handover</strong> &mdash; Our representative meets you directly at Dabolim Airport, Mopa Airport, or your resort lobby with sanitized keys.</li>
        <li><strong>Step 4: Return with Ease</strong> &mdash; Drop off the vehicle at the airport departure gates or your resort when your holiday concludes.</li>
      </ul>

      <h2>Fleet Options for Every Type of Goa Traveler</h2>
      <p>We maintain an exclusive in-house fleet of modern, air-conditioned vehicles:</p>
      <ul>
        <li><strong>Compact Hatchbacks (Swift, i20, Baleno):</strong> Ideal for navigating narrow Portuguese heritage village roads and parking easily near bustling beaches.</li>
        <li><strong>Family 7-Seaters (Innova Crysta, Ertiga):</strong> Spacious, luggage-friendly vehicles with dual AC vents designed for family reunions and friend groups.</li>
        <li><strong>Commanding 4x4 SUVs (Mahindra Thar, Fortuner):</strong> Iconic style, high ground clearance, and rugged performance for ultimate Goa road trips.</li>
        <li><strong>Luxury &amp; Convertibles (BMW 4-Series, Audi A4):</strong> Elevated executive style and open-air sunset drives along Miramar and Candolim.</li>
      </ul>
    `,
    faqs: [
      {
        q: "What is the minimum age to rent a self-drive car in Goa?",
        a: "The minimum driving age is 21 years. You must hold an active, original permanent Indian Driving License or an International Driving Permit (IDP) alongside a valid foreign passport."
      },
      {
        q: "Are kilometers limited during the rental period?",
        a: "No, Car Castle Goa offers 100% unlimited kilometers within Goa state borders. You are free to drive as much as you like without per-kilometer surcharges."
      },
      {
        q: "Can I drive the rental car outside the state of Goa?",
        a: "Our vehicles carry commercial yellow-board tourist permits registered for the State of Goa. Cross-border travel to Maharashtra or Karnataka requires prior written authorization and payment of state border road tax."
      }
    ]
  },
  {
    title: "Goa Airport Car Rental | Dabolim (GOI) & Mopa (GOX) Delivery",
    description: "Rent a self drive car at Dabolim Airport (GOI) or Mopa Airport (GOX). Terminal arrival pickup, flight tracking, zero waiting time. Book now on WhatsApp!",
    slug: "airport-car-rental-goa",
    filename: "airport-car-rental-goa.html",
    h1: "Goa Airport Car Rental Delivery (Dabolim GOI & Mopa GOX)",
    subtitle: "Skip costly taxi lines. Pick up your clean, air-conditioned self-drive car directly at arrivals and drive straight to your hotel.",
    serviceType: "AirportTransferAndRental",
    summary: {
      rate: "From ₹1,500/day (Free airport handover on 3+ day bookings)",
      airports: "Dabolim (GOI) & Manohar Int'l Mopa (GOX)",
      flightTracking: "Real-time arrival flight tracking included",
      pickupPoint: "Right outside terminal arrivals exit",
      returnPoint: "Terminal departure drop-off zone",
      support: "24/7 dedicated airport fleet team"
    },
    contentHtml: `
      <h2>Seamless Airport Handover at Goa's Two International Airports</h2>
      <p>Goa is serviced by two major international airports separated by over 60 kilometers: <strong>Dabolim Airport (GOI)</strong> in South-Central Goa and <strong>Manohar International Airport, Mopa (GOX)</strong> in extreme North Goa. Depending on where your flight lands and where your hotel is located, taxi fares can easily exceed ₹2,500 to ₹4,500.</p>
      
      <p>With <strong>Car Castle Goa</strong>, your rental car is waiting right in the airport pickup zone as you step out with your bags. Our airport logistics team tracks your flight status in real time, ensuring no delays even if your flight arrives early or late.</p>

      <h2>Dabolim Airport (GOI) Pickup Procedure</h2>
      <p>Located near Vasco da Gama, Dabolim Airport is convenient for travelers heading to Central Goa (Panjim, Dona Paula) and South Goa resorts (Colva, Cavelossim, Majorda, Palolem). Our staff coordinates via WhatsApp 30 minutes before your landing, shares the vehicle registration number, and guides you to the short-term parking lot just 100 meters from the domestic arrival gate.</p>

      <h2>Mopa Airport (GOX) Pickup Procedure</h2>
      <p>Situated in Pernem, North Goa, Mopa Airport is closest to Northern beach hubs like Morjim, Mandrem, Arambol, Vagator, and Anjuna. Once you exit arrivals, our executive meets you at the designated pickup bay. Inspection and digital handover take less than 5 minutes, allowing you to hit the new Mopa Expressway without delay.</p>

      <h2>Recommended Vehicles for Airport Transit</h2>
      <ul>
        <li><strong>Toyota Innova Crysta &amp; Maruti Ertiga:</strong> Excellent for 4 to 7 passengers traveling with multiple large suitcases and trolley bags.</li>
        <li><strong>Hyundai Creta &amp; Kia Seltos:</strong> Generous boot space with commanding SUV ride height for smooth highway transit.</li>
        <li><strong>Maruti Swift &amp; Baleno:</strong> Zippy, affordable hatchbacks with sufficient boot capacity for 2 medium bags and backpacks.</li>
      </ul>
    `,
    faqs: [
      {
        q: "What happens if my flight to Goa is delayed?",
        a: "We track your flight number in real time. If your flight is delayed, our airport representative automatically adjusts the handover schedule at zero extra penalty."
      },
      {
        q: "Can I pick up the car at Mopa Airport (GOX) and drop it off at Dabolim Airport (GOI)?",
        a: "Yes! We offer flexible multi-airport drop-offs. You can pick up your vehicle at Mopa and return it at Dabolim (or vice versa) with prior notice."
      },
      {
        q: "Is there any parking fee at the airport for vehicle handover?",
        a: "No, our representative manages parking fees up to the scheduled delivery time. You take the wheel and drive off immediately."
      }
    ]
  },
  {
    title: "Monthly Car Rental Goa | Long Term Self Drive Subscriptions",
    description: "Affordable monthly & long term self drive car rentals in Goa starting from ₹28,000/month. Free routine servicing, doorstep replacement, zero maintenance hassle.",
    slug: "monthly-car-rental-goa",
    filename: "monthly-car-rental-goa.html",
    h1: "Monthly & Long-Term Self-Drive Car Rentals in Goa",
    subtitle: "Flexible 30-day to 6-month vehicle rentals designed for digital nomads, remote workers, expats, and extended Goa holidaymakers.",
    serviceType: "LongTermCarRental",
    summary: {
      rate: "Starting ₹28,000 to ₹65,000 / Month",
      maintenance: "Zero maintenance cost (routine servicing included)",
      insurance: "Full commercial vehicle coverage included",
      swapOption: "Option to upgrade or swap vehicle model monthly",
      duration: "From 30 days to 6 months",
      inclusions: "Free doorstep maintenance, 24/7 emergency support"
    },
    contentHtml: `
      <h2>The Smart Solution for Extended Stays in Goa</h2>
      <p>Goa has evolved into India's premier hub for digital nomads, tech entrepreneurs, creative professionals, and remote workers. Buying a car or relying on daily taxi rentals is neither cost-effective nor practical for stays lasting 1 to 6 months.</p>
      
      <p><strong>Car Castle Goa's Monthly Car Subscription</strong> delivers the freedom of vehicle ownership without the depreciation, insurance premiums, registration red tape, or maintenance headaches. With a single predictable monthly payment, you get a fully serviced, insured car delivered directly to your villa or apartment in Assagao, Siolim, Porvorim, or Candolim.</p>

      <h2>Monthly Rental Benefits with Car Castle</h2>
      <ul>
        <li><strong>Substantial Cost Savings:</strong> Enjoy daily effective rates as low as ₹930/day compared to standard ₹1,500 daily rates.</li>
        <li><strong>Complimentary Routine Servicing:</strong> Every 5,000 km or 30 days, we perform scheduled oil and brake inspections or provide a temporary doorstep replacement vehicle so your life never stops.</li>
        <li><strong>Commercial Insurance Included:</strong> Full third-party and comprehensive accidental coverage protects you from unexpected liability.</li>
        <li><strong>Model Upgrades:</strong> Switch from a hatchback to a Thar 4x4 or 7-seater SUV when friends or family visit for a weekend trip.</li>
      </ul>

      <h2>Popular Monthly Subscription Models</h2>
      <div class="pricing-table-container">
        <table class="pricing-table">
          <thead>
            <tr>
              <th>Vehicle Model</th>
              <th>Category</th>
              <th>Monthly Rate</th>
              <th>Fuel &amp; Transmission</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Maruti Suzuki Swift</strong></td>
              <td>Hatchback</td>
              <td><span class="pricing-tag">₹28,000 <span>/ month</span></span></td>
              <td>Petrol / Manual</td>
            </tr>
            <tr>
              <td><strong>Hyundai i20 Asta</strong></td>
              <td>Automatic Hatchback</td>
              <td><span class="pricing-tag">₹30,000 <span>/ month</span></span></td>
              <td>Petrol / Automatic</td>
            </tr>
            <tr>
              <td><strong>Hyundai Creta SX</strong></td>
              <td>Compact SUV</td>
              <td><span class="pricing-tag">₹52,000 <span>/ month</span></span></td>
              <td>Petrol / Automatic</td>
            </tr>
            <tr>
              <td><strong>Mahindra Thar 4x4</strong></td>
              <td>4x4 Lifestyle SUV</td>
              <td><span class="pricing-tag">₹68,000 <span>/ month</span></span></td>
              <td>Diesel / Automatic</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    faqs: [
      {
        q: "What is the minimum lock-in period for a monthly car rental in Goa?",
        a: "The minimum commitment is 30 days. You can extend month-to-month with 5 days advance notice prior to your renewal date."
      },
      {
        q: "How does periodic maintenance work for long-term rentals?",
        a: "We manage all routine servicing at zero charge to you. Our mobile mechanic performs minor checks at your residence, or we swap the car for a courtesy vehicle during scheduled major services."
      },
      {
        q: "Is a security deposit required for monthly rentals?",
        a: "Yes, a refundable security deposit of ₹5,000 to ₹10,000 (depending on car model) is required upon signing. It is fully refunded via bank transfer or UPI within 48 hours of vehicle return."
      }
    ]
  }
];

function generateServiceHTML(svc) {
  return `<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${svc.title}</title>
  <meta name="description" content="${svc.description}" />
  <link rel="canonical" href="https://carcastlegoa.com/services/${svc.filename}" />
  <meta name="theme-color" content="#0f172a" />

  <!-- Verification Placeholders -->
  <meta name="google-site-verification" content="[YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE]" />
  <meta name="msvalidate.01" content="[YOUR_BING_VERIFICATION_CODE]" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://carcastlegoa.com/services/${svc.filename}" />
  <meta property="og:title" content="${svc.title}" />
  <meta property="og:description" content="${svc.description}" />
  <meta property="og:image" content="https://carcastlegoa.com/images/hero_road.jpg" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${svc.title}" />
  <meta name="twitter:description" content="${svc.description}" />
  <meta name="twitter:image" content="https://carcastlegoa.com/images/hero_road.jpg" />

  <!-- Favicons -->
  <link rel="icon" type="image/png" sizes="32x32" href="../images/favicons/favicon-32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="../images/favicons/favicon-16.png" />
  <link rel="icon" type="image/png" href="../images/favicon.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="../images/apple-touch-icon.png" />
  <link rel="shortcut icon" href="../images/favicon.ico" />
  <link rel="stylesheet" href="../css/styles.css" />

  <!-- Schema Markup (JSON-LD) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://carcastlegoa.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Services",
            "item": "https://carcastlegoa.com/services/${svc.filename}"
          }
        ]
      },
      {
        "@type": "Service",
        "@id": "https://carcastlegoa.com/services/${svc.filename}#service",
        "name": "${svc.h1}",
        "serviceType": "${svc.serviceType}",
        "provider": {
          "@type": "AutoRental",
          "name": "Car Castle Rentals Goa",
          "telephone": "+918767286682",
          "url": "https://carcastlegoa.com",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Panjim",
            "addressRegion": "Goa",
            "postalCode": "403001",
            "addressCountry": "IN"
          }
        },
        "areaServed": {
          "@type": "State",
          "name": "Goa"
        },
        "description": "${svc.description}"
      },
      {
        "@type": "FAQPage",
        "mainEntity": ${JSON.stringify(svc.faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        })))}
      }
    ]
  }
  </script>
</head>
<body>

  <!-- Header -->
  <header class="header-nav">
    <div class="nav-wrapper">
      <a href="../index.html" class="nav-brand"><img src="../images/logo.png" alt="Car Castle Goa Logo" class="logo-img" /></a>
      <nav class="nav-links">
        <a href="../index.html" class="nav-link">Home</a>
        <a href="../all-cars.html" class="nav-link">All Cars</a>
        <a href="../about.html" class="nav-link">About</a>
        <a href="../contact.html" class="nav-link">Contact</a>
      </nav>
      <div class="nav-actions">
        <a href="https://wa.me/918767286682?text=Hi%20Car%20Castle%20Goa%2C%20I%20want%20to%20enquire%20about%20${encodeURIComponent(svc.h1)}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp">Book via WhatsApp</a>
      </div>
      <button id="mobile-toggle" class="mobile-toggle" aria-label="Toggle Navigation Menu">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
    </div>
  </header>

  <!-- Mobile Drawer -->
  <div id="mobile-drawer" class="mobile-drawer">
    <div style="margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255, 255, 255, 0.12);">
      <a href="../index.html">
        <img src="../images/logo.png" alt="Car Castle Logo" style="height: 36px; width: auto; filter: brightness(0) invert(1);" />
      </a>
    </div>
    <a href="../index.html" class="nav-link">Home</a>
    <a href="../all-cars.html" class="nav-link">All Cars</a>
    <a href="../about.html" class="nav-link">About</a>
    <a href="../contact.html" class="nav-link">Contact</a>
  </div>

  <!-- Breadcrumbs -->
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <div class="container">
      <ol class="breadcrumb-list">
        <li class="breadcrumb-item"><a href="../index.html">Home</a></li>
        <li class="breadcrumb-separator">/</li>
        <li class="breadcrumb-item">Services</li>
        <li class="breadcrumb-separator">/</li>
        <li class="breadcrumb-item current" aria-current="page">${svc.h1}</li>
      </ol>
    </div>
  </nav>

  <!-- Page Header -->
  <section class="section" style="background-color: var(--bg-light); padding-top: 3.5rem; padding-bottom: 2.5rem;">
    <div class="container" style="max-width: 900px; text-align: center;">
      <h1 class="section-title" style="margin-bottom: 0.75rem;">${svc.h1}</h1>
      <p class="section-subtitle" style="margin: 0 auto; max-width: 750px;">${svc.subtitle}</p>
    </div>
  </section>

  <!-- Content Section -->
  <main class="section">
    <div class="container" style="max-width: 900px;">
      
      <!-- Quick Facts Box -->
      <div class="quick-facts-box">
        <div class="quick-facts-header">
          <svg width="22" height="22" fill="none" stroke="var(--secondary)" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h2 class="quick-facts-title">${svc.h1} &mdash; Quick Facts</h2>
        </div>
        <div class="quick-facts-grid">
          ${Object.entries(svc.summary).map(([k, v]) => `
            <div class="fact-item">
              <span class="fact-label">${k.replace(/([A-Z])/g, ' $1')}</span>
              <span class="fact-val">${v}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="article-content">
        ${svc.contentHtml}
      </div>

      <!-- FAQ Section -->
      <section style="margin-top: 3.5rem;">
        <h2 style="font-size: 1.65rem; font-weight: 700; color: var(--primary); margin-bottom: 1.25rem;">
          Frequently Asked Questions
        </h2>
        <div class="faq-container">
          ${svc.faqs.map(f => `
            <div class="faq-item">
              <button class="faq-button">
                <span>${f.q}</span>
                <svg class="faq-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div class="faq-answer">${f.a}</div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Booking Callout -->
      <div class="review-prompt-card" style="margin-top: 3rem;">
        <div>
          <h3 class="review-prompt-title">Ready to Book Your Self-Drive Car?</h3>
          <p class="review-prompt-desc">Contact our team right now on WhatsApp. Send your travel dates and receive instant confirmation with car photos.</p>
        </div>
        <a href="https://wa.me/918767286682?text=Hi%20Car%20Castle%20Goa%2C%20I%20want%20to%20book%20a%20car%20now!" target="_blank" rel="noopener noreferrer" class="btn-whatsapp" style="font-size: 1.05rem; padding: 0.85rem 1.75rem;">
          Chat on WhatsApp
        </a>
      </div>

    </div>
  </main>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-grid">
      <div>
        <img src="../images/logo.png" alt="Car Castle Goa Logo" class="footer-logo" />
        <p class="footer-about">Car Castle is Goa's trusted self-drive car rental provider. Doorstep delivery across North &amp; South Goa.</p>
      </div>
      <div>
        <h4 class="footer-heading">Quick Links</h4>
        <ul class="footer-links">
          <li><a href="../index.html">Home</a></li>
          <li><a href="../all-cars.html">All Cars</a></li>
          <li><a href="../reg-cars.html">Regular Cars</a></li>
          <li><a href="../prem-cars.html">Premium Cars</a></li>
          <li><a href="../about.html">About Us</a></li>
          <li><a href="../contact.html">Contact Us</a></li>
        </ul>
      </div>
      <div>
        <h4 class="footer-heading">Contact Us</h4>
        <div class="footer-contact-item"><span>Location: Panjim, Calangute, Dabolim &amp; Mopa Airport, Goa</span></div>
        <div class="footer-contact-item"><span>Phone: <a href="tel:+918767286682" style="color: inherit;">+91 87672 86682</a></span></div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 Car Castle Rentals Goa. All rights reserved.</p>
    </div>
  </footer>

  <script src="../js/main.js"></script>
  <script src="../js/analytics.js"></script>
</body>
</html>`;
}

const outDir = path.join(__dirname, '..', 'carcastlegoa', 'services');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

services.forEach(svc => {
  const filePath = path.join(outDir, svc.filename);
  fs.writeFileSync(filePath, generateServiceHTML(svc), 'utf8');
  console.log(`Generated Service: ${svc.filename}`);
});

console.log('All 3 Service landing pages generated successfully!');
