const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'carcastlegoa');

// 1. Pricing Page
const pricingHTML = `<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Car Rental Prices in Goa | Transparent Daily & Monthly Rates</title>
  <meta name="description" content="View transparent self drive car rental tariffs in Goa. Hatchbacks from ₹1,500/day, SUVs from ₹2,800/day, Thar 4x4 at ₹3,500/day. Zero hidden fees, book on WhatsApp!" />
  <link rel="canonical" href="https://carcastlegoa.com/pricing.html" />
  <meta name="theme-color" content="#0f172a" />

  <meta name="google-site-verification" content="[YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE]" />
  <meta name="msvalidate.01" content="[YOUR_BING_VERIFICATION_CODE]" />

  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://carcastlegoa.com/pricing.html" />
  <meta property="og:title" content="Car Rental Prices in Goa | Transparent Rates from ₹1,500/Day" />
  <meta property="og:description" content="Affordable self-drive car rental rates in Goa. Compare hatchbacks, sedans, 7-seaters, and luxury convertibles." />
  <meta property="og:image" content="https://carcastlegoa.com/images/hero_road.jpg" />

  <link rel="icon" type="image/png" sizes="32x32" href="images/favicons/favicon-32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="images/favicons/favicon-16.png" />
  <link rel="icon" type="image/png" href="images/favicon.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png" />
  <link rel="shortcut icon" href="images/favicon.ico" />
  <link rel="stylesheet" href="css/styles.css" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://carcastlegoa.com/" },
          { "@type": "ListItem", "position": 2, "name": "Pricing", "item": "https://carcastlegoa.com/pricing.html" }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Are there any hidden charges or surprise taxes at return?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. The price we quote on WhatsApp is the total price you pay. There are zero surprise cleaning fees, zero booking fees, and zero return deductions provided the vehicle is returned in normal condition."
            }
          },
          {
            "@type": "Question",
            "name": "How does the 24-hour rental billing cycle work in Goa?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our rentals operate on a standard 24-hour cycle from the exact time of delivery. For example, if you pick up the car at 10:00 AM on Monday, your 1-day rental runs until 10:00 AM on Tuesday."
            }
          },
          {
            "@type": "Question",
            "name": "Do car rental prices increase during December and New Year in Goa?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "During peak Christmas and New Year festive season (December 20 to January 5), market demand spikes across Goa and festive surcharges apply. We recommend booking 2 to 4 weeks in advance to secure regular rates."
            }
          }
        ]
      }
    ]
  }
  </script>
</head>
<body>

  <header class="header-nav">
    <div class="nav-wrapper">
      <a href="index.html" class="nav-brand"><img src="images/logo.png" alt="Car Castle Goa Logo" class="logo-img" /></a>
      <nav class="nav-links">
        <a href="index.html" class="nav-link">Home</a>
        <a href="all-cars.html" class="nav-link">All Cars</a>
        <a href="pricing.html" class="nav-link active">Pricing</a>
        <a href="about.html" class="nav-link">About</a>
        <a href="contact.html" class="nav-link">Contact</a>
      </nav>
      <div class="nav-actions">
        <a href="https://wa.me/918767286682?text=Hi%20Car%20Castle%20Goa%2C%20I%20want%20to%20enquire%20about%20car%20rental%20rates" target="_blank" rel="noopener noreferrer" class="btn-whatsapp">Book via WhatsApp</a>
      </div>
      <button id="mobile-toggle" class="mobile-toggle" aria-label="Toggle Navigation Menu">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
    </div>
  </header>

  <div id="mobile-drawer" class="mobile-drawer">
    <div style="margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255, 255, 255, 0.12);">
      <a href="index.html"><img src="images/logo.png" alt="Car Castle Logo" style="height: 36px; width: auto; filter: brightness(0) invert(1);" /></a>
    </div>
    <a href="index.html" class="nav-link">Home</a>
    <a href="all-cars.html" class="nav-link">All Cars</a>
    <a href="pricing.html" class="nav-link">Pricing</a>
    <a href="about.html" class="nav-link">About</a>
    <a href="contact.html" class="nav-link">Contact</a>
  </div>

  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <div class="container">
      <ol class="breadcrumb-list">
        <li class="breadcrumb-item"><a href="index.html">Home</a></li>
        <li class="breadcrumb-separator">/</li>
        <li class="breadcrumb-item current" aria-current="page">Pricing</li>
      </ol>
    </div>
  </nav>

  <section class="section" style="background-color: var(--bg-light); padding-top: 3.5rem; padding-bottom: 2.5rem;">
    <div class="container" style="max-width: 900px; text-align: center;">
      <h1 class="section-title">Transparent Car Rental Pricing in Goa</h1>
      <p class="section-subtitle" style="margin: 0 auto; max-width: 750px;">Clear, honest tariffs per 24-hour cycle. What we quote on WhatsApp is exactly what you pay. Zero hidden fees.</p>
    </div>
  </section>

  <main class="section">
    <div class="container" style="max-width: 960px;">

      <div class="quick-facts-box">
        <div class="quick-facts-header">
          <svg width="22" height="22" fill="none" stroke="var(--secondary)" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h2 class="quick-facts-title">What is Included in Every Rental:</h2>
        </div>
        <div class="quick-facts-grid">
          <div class="fact-item"><span class="fact-label">Kilometers</span><span class="fact-val">100% Unlimited</span></div>
          <div class="fact-item"><span class="fact-label">Insurance</span><span class="fact-val">Comprehensive Included</span></div>
          <div class="fact-item"><span class="fact-label">Assistance</span><span class="fact-val">24/7 Goa-wide Support</span></div>
          <div class="fact-item"><span class="fact-label">Sanitization</span><span class="fact-val">Disinfected Before Delivery</span></div>
          <div class="fact-item"><span class="fact-label">Billing Cycle</span><span class="fact-val">Full 24-Hour Block</span></div>
          <div class="fact-item"><span class="fact-label">Deposit</span><span class="fact-val">Fast Refundable Deposit</span></div>
        </div>
      </div>

      <div class="pricing-table-container">
        <table class="pricing-table">
          <thead>
            <tr>
              <th>Vehicle Model</th>
              <th>Category</th>
              <th>Transmission</th>
              <th>Seats</th>
              <th>Daily Rate (24h)</th>
              <th>Weekly Rate (7d)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><a href="cars/maruti-swift-rental-goa.html"><strong>Maruti Suzuki Swift</strong></a></td>
              <td>Hatchback</td>
              <td>Manual</td>
              <td>5</td>
              <td><span class="pricing-tag">₹1,500</span></td>
              <td>₹9,500</td>
              <td><a href="cars/maruti-swift-rental-goa.html" class="blog-read-link">Details &rarr;</a></td>
            </tr>
            <tr>
              <td><a href="cars/hyundai-i20-rental-goa.html"><strong>Hyundai i20 Asta</strong></a></td>
              <td>Hatchback</td>
              <td>Automatic</td>
              <td>5</td>
              <td><span class="pricing-tag">₹1,500</span></td>
              <td>₹9,500</td>
              <td><a href="cars/hyundai-i20-rental-goa.html" class="blog-read-link">Details &rarr;</a></td>
            </tr>
            <tr>
              <td><a href="cars/maruti-baleno-rental-goa.html"><strong>Maruti Baleno Alpha</strong></a></td>
              <td>Premium Hatch</td>
              <td>Automatic</td>
              <td>5</td>
              <td><span class="pricing-tag">₹1,600</span></td>
              <td>₹10,500</td>
              <td><a href="cars/maruti-baleno-rental-goa.html" class="blog-read-link">Details &rarr;</a></td>
            </tr>
            <tr>
              <td><a href="cars/maruti-ertiga-7-seater-rental-goa.html"><strong>Maruti Ertiga ZXi</strong></a></td>
              <td>7-Seater MPV</td>
              <td>Manual</td>
              <td>7</td>
              <td><span class="pricing-tag">₹2,200</span></td>
              <td>₹14,500</td>
              <td><a href="cars/maruti-ertiga-7-seater-rental-goa.html" class="blog-read-link">Details &rarr;</a></td>
            </tr>
            <tr>
              <td><a href="cars/hyundai-creta-rental-goa.html"><strong>Hyundai Creta SX</strong></a></td>
              <td>Compact SUV</td>
              <td>Automatic</td>
              <td>5</td>
              <td><span class="pricing-tag">₹2,800</span></td>
              <td>₹18,500</td>
              <td><a href="cars/hyundai-creta-rental-goa.html" class="blog-read-link">Details &rarr;</a></td>
            </tr>
            <tr>
              <td><a href="cars/kia-seltos-rental-goa.html"><strong>Kia Seltos GTX</strong></a></td>
              <td>Premium SUV</td>
              <td>Automatic</td>
              <td>5</td>
              <td><span class="pricing-tag">₹2,900</span></td>
              <td>₹19,000</td>
              <td><a href="cars/kia-seltos-rental-goa.html" class="blog-read-link">Details &rarr;</a></td>
            </tr>
            <tr>
              <td><a href="cars/toyota-innova-crysta-rental-goa.html"><strong>Toyota Innova Crysta</strong></a></td>
              <td>Executive 7-Seater</td>
              <td>Manual / Auto</td>
              <td>7</td>
              <td><span class="pricing-tag">₹3,200</span></td>
              <td>₹21,000</td>
              <td><a href="cars/toyota-innova-crysta-rental-goa.html" class="blog-read-link">Details &rarr;</a></td>
            </tr>
            <tr>
              <td><a href="cars/mahindra-thar-rental-goa.html"><strong>Mahindra Thar 4x4</strong></a></td>
              <td>Lifestyle 4x4 SUV</td>
              <td>Automatic 4WD</td>
              <td>4</td>
              <td><span class="pricing-tag">₹3,500</span></td>
              <td>₹23,500</td>
              <td><a href="cars/mahindra-thar-rental-goa.html" class="blog-read-link">Details &rarr;</a></td>
            </tr>
            <tr>
              <td><a href="cars/toyota-fortuner-rental-goa.html"><strong>Toyota Fortuner 4x4</strong></a></td>
              <td>Luxury 7-Seater</td>
              <td>Automatic</td>
              <td>7</td>
              <td><span class="pricing-tag">₹5,500</span></td>
              <td>₹36,000</td>
              <td><a href="cars/toyota-fortuner-rental-goa.html" class="blog-read-link">Details &rarr;</a></td>
            </tr>
            <tr>
              <td><a href="cars/audi-a4-luxury-rental-goa.html"><strong>Audi A4 Luxury Sedan</strong></a></td>
              <td>Luxury Sedan</td>
              <td>Automatic</td>
              <td>5</td>
              <td><span class="pricing-tag">₹6,500</span></td>
              <td>₹42,000</td>
              <td><a href="cars/audi-a4-luxury-rental-goa.html" class="blog-read-link">Details &rarr;</a></td>
            </tr>
            <tr>
              <td><a href="cars/bmw-4-series-convertible-rental-goa.html"><strong>BMW 4-Series Convertible</strong></a></td>
              <td>Luxury Convertible</td>
              <td>Automatic</td>
              <td>4</td>
              <td><span class="pricing-tag">₹7,500</span></td>
              <td>₹49,000</td>
              <td><a href="cars/bmw-4-series-convertible-rental-goa.html" class="blog-read-link">Details &rarr;</a></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- FAQ Section -->
      <section style="margin-top: 3rem;">
        <h2 style="font-size: 1.65rem; font-weight: 700; color: var(--primary); margin-bottom: 1.25rem;">
          Pricing &amp; Tariff FAQs
        </h2>
        <div class="faq-container">
          <div class="faq-item">
            <button class="faq-button">
              <span>Are there any hidden charges or surprise taxes at return?</span>
              <svg class="faq-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div class="faq-answer">
              No. The price we quote on WhatsApp is the total price you pay. There are zero surprise cleaning fees, zero booking fees, and zero return deductions provided the vehicle is returned in normal condition.
            </div>
          </div>
          <div class="faq-item">
            <button class="faq-button">
              <span>How does the 24-hour rental billing cycle work in Goa?</span>
              <svg class="faq-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div class="faq-answer">
              Our rentals operate on a standard 24-hour cycle from the exact time of delivery. For example, if you pick up the car at 10:00 AM on Monday, your 1-day rental runs until 10:00 AM on Tuesday.
            </div>
          </div>
          <div class="faq-item">
            <button class="faq-button">
              <span>Do car rental prices increase during December and New Year in Goa?</span>
              <svg class="faq-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div class="faq-answer">
              During peak Christmas and New Year festive season (December 20 to January 5), market demand spikes across Goa and festive surcharges apply. We recommend booking 2 to 4 weeks in advance to secure regular rates.
            </div>
          </div>
        </div>
      </section>

      <div class="review-prompt-card">
        <div>
          <h3 class="review-prompt-title">Lock in Your Dates at Today's Tariff</h3>
          <p class="review-prompt-desc">Send us your travel dates on WhatsApp. We check live fleet availability and lock in your price instantly.</p>
        </div>
        <a href="https://wa.me/918767286682?text=Hi%20Car%20Castle%20Goa%2C%20I%20want%20to%20check%20rates%20and%20book%20a%20car" target="_blank" rel="noopener noreferrer" class="btn-whatsapp" style="padding: 0.85rem 1.75rem; font-size: 1.05rem;">
          Get Live Quote
        </a>
      </div>

    </div>
  </main>

  <footer class="footer">
    <div class="footer-grid">
      <div>
        <img src="images/logo.png" alt="Car Castle Goa Logo" class="footer-logo" />
        <p class="footer-about">Car Castle is Goa's trusted self-drive car rental provider. Doorstep delivery across North &amp; South Goa.</p>
      </div>
      <div>
        <h4 class="footer-heading">Quick Links</h4>
        <ul class="footer-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="all-cars.html">All Cars</a></li>
          <li><a href="pricing.html">Pricing</a></li>
          <li><a href="about.html">About Us</a></li>
          <li><a href="contact.html">Contact Us</a></li>
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

  <script src="js/main.js"></script>
  <script src="js/analytics.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(outDir, 'pricing.html'), pricingHTML, 'utf8');
console.log('Generated pricing.html');

// 2. How It Works Page
const howItWorksHTML = `<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>How It Works | Booking Process & Documents - Car Castle Goa</title>
  <meta name="description" content="Learn how to rent a self-drive car in Goa in 4 simple steps. Documents required, security deposit rules, fuel policy, insurance, and 24/7 roadside assistance." />
  <link rel="canonical" href="https://carcastlegoa.com/how-it-works.html" />
  <meta name="theme-color" content="#0f172a" />

  <link rel="icon" type="image/png" href="images/favicon.png" />
  <link rel="stylesheet" href="css/styles.css" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://carcastlegoa.com/" },
          { "@type": "ListItem", "position": 2, "name": "How It Works", "item": "https://carcastlegoa.com/how-it-works.html" }
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to Rent a Self-Drive Car in Goa with Car Castle",
        "description": "Simple 4-step process to rent a self-drive car in Goa with zero paperwork hassle.",
        "step": [
          {
            "@type": "HowToStep",
            "position": 1,
            "name": "Select Your Vehicle",
            "text": "Browse our 11 sanitized car models and choose between budget hatchbacks, family MPVs, or luxury SUVs."
          },
          {
            "@type": "HowToStep",
            "position": 2,
            "name": "Instant WhatsApp Confirmation",
            "text": "Send your dates and delivery location on WhatsApp (+91 87672 86682) for instant rate confirmation and booking."
          },
          {
            "@type": "HowToStep",
            "position": 3,
            "name": "Doorstep or Airport Handover",
            "text": "Our executive meets you at Dabolim Airport, Mopa Airport, or your resort with keys, baseline photos, and agreement."
          },
          {
            "@type": "HowToStep",
            "position": 4,
            "name": "Enjoy & Hassle-Free Return",
            "text": "Drive unlimited kilometers across Goa. Return the vehicle at your departure airport or hotel."
          }
        ]
      }
    ]
  }
  </script>
</head>
<body>
  <header class="header-nav">
    <div class="nav-wrapper">
      <a href="index.html" class="nav-brand"><img src="images/logo.png" alt="Car Castle Goa Logo" class="logo-img" /></a>
      <nav class="nav-links">
        <a href="index.html" class="nav-link">Home</a>
        <a href="all-cars.html" class="nav-link">All Cars</a>
        <a href="pricing.html" class="nav-link">Pricing</a>
        <a href="about.html" class="nav-link">About</a>
        <a href="contact.html" class="nav-link">Contact</a>
      </nav>
      <div class="nav-actions">
        <a href="https://wa.me/918767286682?text=Hi%20Car%20Castle%20Goa%2C%20I%20want%20to%20rent%20a%20car" target="_blank" rel="noopener noreferrer" class="btn-whatsapp">Book via WhatsApp</a>
      </div>
      <button id="mobile-toggle" class="mobile-toggle" aria-label="Toggle Navigation Menu">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
    </div>
  </header>

  <nav class="breadcrumbs" aria-label="Breadcrumb">
    <div class="container">
      <ol class="breadcrumb-list">
        <li class="breadcrumb-item"><a href="index.html">Home</a></li>
        <li class="breadcrumb-separator">/</li>
        <li class="breadcrumb-item current" aria-current="page">How It Works</li>
      </ol>
    </div>
  </nav>

  <section class="section" style="background-color: var(--bg-light); padding-top: 3.5rem; padding-bottom: 2.5rem;">
    <div class="container" style="max-width: 900px; text-align: center;">
      <h1 class="section-title">How Self-Drive Rental Works in Goa</h1>
      <p class="section-subtitle" style="margin: 0 auto; max-width: 750px;">From booking to vehicle return &mdash; transparent rules, minimal documentation, and zero waiting time.</p>
    </div>
  </section>

  <main class="section">
    <div class="container" style="max-width: 860px;">
      <div class="article-content">
        <h2>1. Documents Required</h2>
        <p>Renting a self-drive car with Car Castle Goa requires minimal documentation:</p>
        <ul>
          <li><strong>For Indian Citizens:</strong> Original valid permanent Driving License (Learner's License not permitted) + Aadhaar Card or Voter ID copy.</li>
          <li><strong>For International Visitors:</strong> Valid Driving License from your home country + International Driving Permit (IDP) + Passport copy with valid Indian Visa.</li>
          <li><strong>Age Requirement:</strong> Primary driver must be at least 21 years of age with a minimum of 1 year of driving experience.</li>
        </ul>

        <h2>2. Fuel Policy (Level-to-Level)</h2>
        <p>All vehicles operate on a fair <strong>Level-to-Level fuel policy</strong>. If your car is delivered with 50% fuel on the gauge, simply return it with 50% fuel. There are no mandatory fuel refill surcharge markups. Numerous petrol stations operate near Dabolim Airport, Mopa Airport, Panjim, and along NH66.</p>

        <h2>3. Security Deposit &amp; Refund Timeline</h2>
        <p>A modest refundable security deposit ranging from <strong>₹0 to ₹3,000</strong> (depending on car model) is collected at handover. Upon vehicle return, our representative performs a quick exterior check and refunds your deposit <strong>immediately on the spot</strong> via UPI (Google Pay / PhonePe) or cash.</p>

        <h2>4. Insurance &amp; Breakdown Support</h2>
        <p>Every car in our fleet is covered by commercial self-drive vehicle insurance. In the rare event of a mechanical breakdown, battery issue, or flat tyre anywhere in Goa, our 24/7 mobile roadside assistance team dispatches immediate support or provides a replacement vehicle free of cost.</p>
      </div>

      <div class="review-prompt-card" style="margin-top: 3rem;">
        <div>
          <h3 class="review-prompt-title">Ready to Reserve Your Car?</h3>
          <p class="review-prompt-desc">Our team confirms availability within 5 minutes. WhatsApp us now with your arrival date.</p>
        </div>
        <a href="https://wa.me/918767286682?text=Hi%20Car%20Castle%20Goa%2C%20I%20have%20read%20how%20it%20works%20and%20want%20to%20book%20a%20car" target="_blank" rel="noopener noreferrer" class="btn-whatsapp" style="font-size: 1.05rem; padding: 0.85rem 1.75rem;">
          Chat on WhatsApp
        </a>
      </div>
    </div>
  </main>

  <footer class="footer">
    <div class="footer-grid">
      <div>
        <img src="images/logo.png" alt="Car Castle Goa Logo" class="footer-logo" />
        <p class="footer-about">Car Castle is Goa's trusted self-drive car rental provider. Doorstep delivery across North &amp; South Goa.</p>
      </div>
      <div>
        <h4 class="footer-heading">Quick Links</h4>
        <ul class="footer-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="all-cars.html">All Cars</a></li>
          <li><a href="pricing.html">Pricing</a></li>
          <li><a href="how-it-works.html">How It Works</a></li>
          <li><a href="terms.html">Terms &amp; Conditions</a></li>
          <li><a href="contact.html">Contact Us</a></li>
        </ul>
      </div>
      <div>
        <h4 class="footer-heading">Contact Us</h4>
        <div class="footer-contact-item"><span>Location: Panjim, Calangute, Dabolim &amp; Mopa Airport, Goa</span></div>
        <div class="footer-contact-item"><span>Phone: +91 87672 86682</span></div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 Car Castle Rentals Goa. All rights reserved.</p>
    </div>
  </footer>

  <script src="js/main.js"></script>
  <script src="js/analytics.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(outDir, 'how-it-works.html'), howItWorksHTML, 'utf8');
console.log('Generated how-it-works.html');

// 3. Terms & Conditions
const termsHTML = `<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Terms & Conditions - Car Castle Goa Self-Drive Rentals</title>
  <meta name="description" content="Read our transparent self drive car rental terms and conditions in Goa. Speed limits, state boundaries, traffic rules, insurance, and security deposit details." />
  <link rel="canonical" href="https://carcastlegoa.com/terms.html" />
  <meta name="theme-color" content="#0f172a" />
  <link rel="icon" type="image/png" href="images/favicon.png" />
  <link rel="stylesheet" href="css/styles.css" />
</head>
<body>
  <header class="header-nav">
    <div class="nav-wrapper">
      <a href="index.html" class="nav-brand"><img src="images/logo.png" alt="Car Castle Logo" class="logo-img" /></a>
      <nav class="nav-links">
        <a href="index.html" class="nav-link">Home</a>
        <a href="all-cars.html" class="nav-link">All Cars</a>
        <a href="pricing.html" class="nav-link">Pricing</a>
        <a href="about.html" class="nav-link">About</a>
        <a href="contact.html" class="nav-link">Contact</a>
      </nav>
      <div class="nav-actions">
        <a href="https://wa.me/918767286682" target="_blank" class="btn-whatsapp">Book via WhatsApp</a>
      </div>
    </div>
  </header>

  <main class="section" style="padding-top: 3.5rem;">
    <div class="container" style="max-width: 820px;">
      <h1 class="section-title" style="text-align: left; margin-bottom: 1.5rem;">Rental Terms &amp; Conditions</h1>
      <div class="article-content">
        <p><strong>Last Updated: October 2026</strong></p>
        <p>Welcome to Car Castle Goa. By renting a self-drive vehicle from Car Castle Rentals Goa, you agree to comply with and be bound by the following operational terms and conditions:</p>
        
        <h2>1. Eligibility and Authorized Drivers</h2>
        <p>The renter must be at least 21 years old and hold a valid, original Driving License (Indian or International Driving Permit) along with a government-issued photo ID (Aadhaar Card or Passport). Only individuals whose credentials have been recorded during handover are authorized to operate the vehicle.</p>

        <h2>2. Permitted Territory &amp; Boundary Restrictions</h2>
        <p>All Car Castle vehicles are registered with yellow-board commercial self-drive permits strictly for operation within the geographical boundaries of the State of Goa. Cross-border travel into neighboring states (Maharashtra or Karnataka) without prior written consent and interstate road permit payment is strictly prohibited.</p>

        <h2>3. Speed Limits &amp; Traffic Compliance</h2>
        <p>Goa Police strictly monitors traffic violations using automated speed cameras and highway patrols. The maximum speed limit on Goa state highways (NH66 / NH566) is <strong>80 km/h</strong>, and <strong>40-50 km/h</strong> in town centers. Driving on beaches or sand dunes is an illegal criminal offense under Goa tourism law. The renter is solely responsible for any e-challans or traffic fines incurred during the rental tenure.</p>

        <h2>4. Fuel &amp; Return Timing</h2>
        <p>Vehicles are provided on a Level-to-Level fuel policy. Billing is based on 24-hour cycles. Grace periods up to 1 hour are provided with advance notice; delays exceeding 1 hour are charged at ₹200/hour or the full day tariff.</p>

        <h2>5. Vehicle Damage &amp; Insurance Deductibles</h2>
        <p>In the event of accidental damage, comprehensive insurance applies subject to standard insurance surveyor assessment. Minor scratches or dents caused by negligence are deducted from the security deposit at actual repair cost.</p>
      </div>
    </div>
  </main>

  <footer class="footer">
    <div class="footer-bottom" style="margin-top: 3rem;">
      <p>&copy; 2026 Car Castle Rentals Goa. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;

fs.writeFileSync(path.join(outDir, 'terms.html'), termsHTML, 'utf8');
console.log('Generated terms.html');

// 4. Privacy Policy
const privacyHTML = `<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Privacy Policy - Car Castle Goa</title>
  <meta name="description" content="Car Castle Goa Privacy Policy. How we collect, verify, and safeguard your personal details for self-drive car rentals." />
  <link rel="canonical" href="https://carcastlegoa.com/privacy.html" />
  <meta name="theme-color" content="#0f172a" />
  <link rel="icon" type="image/png" href="images/favicon.png" />
  <link rel="stylesheet" href="css/styles.css" />
</head>
<body>
  <header class="header-nav">
    <div class="nav-wrapper">
      <a href="index.html" class="nav-brand"><img src="images/logo.png" alt="Car Castle Logo" class="logo-img" /></a>
      <nav class="nav-links">
        <a href="index.html" class="nav-link">Home</a>
        <a href="all-cars.html" class="nav-link">All Cars</a>
        <a href="about.html" class="nav-link">About</a>
        <a href="contact.html" class="nav-link">Contact</a>
      </nav>
      <div class="nav-actions">
        <a href="https://wa.me/918767286682" target="_blank" class="btn-whatsapp">Book via WhatsApp</a>
      </div>
    </div>
  </header>

  <main class="section" style="padding-top: 3.5rem;">
    <div class="container" style="max-width: 820px;">
      <h1 class="section-title" style="text-align: left; margin-bottom: 1.5rem;">Privacy Policy</h1>
      <div class="article-content">
        <p><strong>Last Updated: October 2026</strong></p>
        <p>Car Castle Rentals Goa respects your personal privacy. We only collect details essential for legally validating self-drive vehicle rentals under the Motor Vehicles Act of India.</p>

        <h2>Information We Collect</h2>
        <p>When booking a car, we collect: full name, contact phone number/WhatsApp handle, email address, copies of your Driving License, and government photo identification (Aadhaar or Passport).</p>

        <h2>How Information is Used</h2>
        <p>Your identification data is used solely to verify driver identity, comply with Goa RTO commercial vehicle regulations, process security deposit refunds, and facilitate delivery communications. We never sell, lease, or share your contact data with third-party marketing companies.</p>

        <h2>Data Security</h2>
        <p>All digital verification documents shared via WhatsApp or email are stored securely with restricted access and deleted following the lawful completion of your rental agreement and audit period.</p>
      </div>
    </div>
  </main>

  <footer class="footer">
    <div class="footer-bottom" style="margin-top: 3rem;">
      <p>&copy; 2026 Car Castle Rentals Goa. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;

fs.writeFileSync(path.join(outDir, 'privacy.html'), privacyHTML, 'utf8');
console.log('Generated privacy.html');

// 5. Cancellation & Refund Policy
const cancellationHTML = `<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cancellation & Refund Policy - Car Castle Goa</title>
  <meta name="description" content="Transparent cancellation and refund rules for car rentals in Goa. 100% refund on cancellations made 24 hours prior to pickup." />
  <link rel="canonical" href="https://carcastlegoa.com/cancellation-policy.html" />
  <meta name="theme-color" content="#0f172a" />
  <link rel="icon" type="image/png" href="images/favicon.png" />
  <link rel="stylesheet" href="css/styles.css" />
</head>
<body>
  <header class="header-nav">
    <div class="nav-wrapper">
      <a href="index.html" class="nav-brand"><img src="images/logo.png" alt="Car Castle Logo" class="logo-img" /></a>
      <nav class="nav-links">
        <a href="index.html" class="nav-link">Home</a>
        <a href="all-cars.html" class="nav-link">All Cars</a>
        <a href="pricing.html" class="nav-link">Pricing</a>
        <a href="about.html" class="nav-link">About</a>
        <a href="contact.html" class="nav-link">Contact</a>
      </nav>
      <div class="nav-actions">
        <a href="https://wa.me/918767286682" target="_blank" class="btn-whatsapp">Book via WhatsApp</a>
      </div>
    </div>
  </header>

  <main class="section" style="padding-top: 3.5rem;">
    <div class="container" style="max-width: 820px;">
      <h1 class="section-title" style="text-align: left; margin-bottom: 1.5rem;">Cancellation &amp; Refund Policy</h1>
      <div class="article-content">
        <p><strong>Last Updated: October 2026</strong></p>
        <p>We understand that travel plans can shift due to flight reschedules, weather, or emergencies. Car Castle Goa offers an industry-leading, customer-first cancellation policy:</p>

        <h2>1. Free Cancellation (100% Refund)</h2>
        <p>Cancellations requested at least <strong>24 hours before your scheduled vehicle delivery time</strong> receive a <strong>100% full refund</strong> with zero cancellation penalty.</p>

        <h2>2. Last-Minute Cancellations</h2>
        <p>If cancellation is requested less than 24 hours before delivery, a 1-day rental charge or advance token amount may be retained to cover logistics, fuel staging, and reservation block costs.</p>

        <h2>3. Flight Cancellation or Rescheduling</h2>
        <p>If your flight into Dabolim (GOI) or Mopa (GOX) is cancelled or delayed by the airline, simply notify us via WhatsApp with your flight update. We will adjust your delivery time or transfer your reservation to your new arrival date free of charge.</p>

        <h2>4. Security Deposit Refund</h2>
        <p>Security deposits are verified and processed immediately at vehicle drop-off via UPI transfer (Google Pay, PhonePe, Paytm) or cash.</p>
      </div>
    </div>
  </main>

  <footer class="footer">
    <div class="footer-bottom" style="margin-top: 3rem;">
      <p>&copy; 2026 Car Castle Rentals Goa. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;

fs.writeFileSync(path.join(outDir, 'cancellation-policy.html'), cancellationHTML, 'utf8');
console.log('Generated cancellation-policy.html');
