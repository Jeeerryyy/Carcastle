const fs = require('fs');
const path = require('path');

const locations = [
  {
    title: "Dabolim Airport Car Rental Goa (GOI) | Self Drive Delivery",
    description: "Self drive car rental at Dabolim Airport (GOI) Goa. Terminal handover, zero delay, lowest rates from ₹1,500/day. Drive directly to your hotel. Book now!",
    slug: "dabolim-airport-car-rental",
    filename: "dabolim-airport-car-rental.html",
    h1: "Dabolim Airport (GOI) Self-Drive Car Rental",
    areaName: "Dabolim Airport (GOI)",
    locality: "Vasco da Gama",
    geo: { lat: "15.3808", lng: "73.8314" },
    subtitle: "Step off your flight and drive away in your sanitized self-drive car. No waiting, no taxi bargaining, 24/7 terminal handover.",
    distances: [
      { to: "Panjim City Center", dist: "28 km (35 mins via NH66 / Zuari Bridge)" },
      { to: "Calangute & Baga Beaches", dist: "40 km (55 mins via Atal Setu)" },
      { to: "Colva & Benaulim (South Goa)", dist: "24 km (30 mins via Margao)" },
      { to: "Palolem & Agonda Beach", dist: "62 km (1 hr 25 mins)" }
    ],
    localTips: [
      "Terminal Exit: Our representative meets you outside Gate 2 with your vehicle parked within 100 meters in the short-term lot.",
      "Zuari Bridge Highway: The multi-lane cable bridge offers a smooth 35-minute drive directly into Central Panjim.",
      "Fuel Availability: A reliable Indian Oil petrol pump is situated just 1.5 km outside the airport exit on the highway."
    ],
    contentHtml: `
      <h2>The Smartest Way to Start Your Goa Vacation from Dabolim</h2>
      <p>Landing at <strong>Dabolim Airport (GOI)</strong> in Central Goa puts you in prime position to reach either North or South Goa. However, airport prepaid taxi counters frequently charge upwards of ₹2,200 to North Goa and ₹2,800 to South Goa for a single one-way drop.</p>
      
      <p>With <strong>Car Castle Goa</strong>, you receive your dedicated self-drive car right outside the arrivals lounge. The cost for a full 24-hour car rental starts at only <strong>₹1,500/day</strong> &mdash; giving you unlimited kilometers and the liberty to stop at local restaurants, spice farms, or beaches on your way to the hotel.</p>

      <h2>Terminal Handover &amp; Return Procedure</h2>
      <p>Our airport operations team monitors your flight status using real-time flight tracking software. Once you collect your checked luggage, call or WhatsApp our coordinator. We conduct a quick 3-minute vehicle inspection, verify your Driving License and Aadhaar, snap baseline odometer and fuel photos, and hand over the keys.</p>
    `,
    faqs: [
      {
        q: "Where exactly will the car be handed over at Dabolim Airport?",
        a: "Our executive meets you right outside the Domestic Arrivals exit terminal. Your car is stationed in the adjacent short-term parking bay, requiring just a 2-minute walk."
      },
      {
        q: "Can I return the car at Dabolim Airport when catching my departure flight?",
        a: "Yes. Simply notify us 30 minutes before reaching the airport. Our representative will meet you at the departure drop-off porch, verify the vehicle, and refund any security deposit immediately."
      },
      {
        q: "What if my flight arrives late at night at Dabolim?",
        a: "We operate 24/7 round-the-clock. Whether your flight lands at 2:00 AM or 11:30 PM, our staff is on-site to ensure a seamless handover."
      }
    ]
  },
  {
    title: "Mopa Airport Car Rental Goa (GOX) | Self Drive Cars",
    description: "Rent self drive cars at Manohar International Airport Mopa (GOX), North Goa. Direct terminal pickup, expressway access, sanitized fleet. Instant WhatsApp booking!",
    slug: "mopa-airport-car-rental",
    filename: "mopa-airport-car-rental.html",
    h1: "Manohar International Airport Mopa (GOX) Car Rental",
    areaName: "Mopa Airport (GOX)",
    locality: "Pernem",
    geo: { lat: "15.7538", lng: "73.8647" },
    subtitle: "Fastest access to North Goa's top beaches. Direct terminal vehicle delivery on the new 6-lane Mopa Expressway.",
    distances: [
      { to: "Morjim, Mandrem & Ashwem", dist: "28 km (35 mins via Pernem-Agarwada road)" },
      { to: "Vagator, Anjuna & Chapora", dist: "34 km (40 mins via NH66)" },
      { to: "Calangute & Candolim", dist: "38 km (45 mins via Mapusa)" },
      { to: "Panjim City Center", dist: "35 km (40 mins via new Expressway)" }
    ],
    localTips: [
      "Expressway Connectivity: The newly opened 6-lane elevated Mopa link road connects directly to NH66, bypassing congested rural lanes.",
      "Speed Cameras: The Mopa Expressway has automated speed cameras enforced strictly at 80 km/h. Keep within limits.",
      "Late Night Arrivals: Flights landing past midnight benefit greatly from pre-booked self-drive cars, avoiding inflated late-night taxi tariffs."
    ],
    contentHtml: `
      <h2>Fly into Mopa (GOX) and Hit North Goa's Best Beaches</h2>
      <p><strong>Manohar International Airport at Mopa (GOX)</strong> has revolutionized travel to North Goa, drastically slashing commute times to Morjim, Mandrem, Arambol, and Assagao. However, due to its remote plateau location, on-demand cab prices to beach resorts often exceed ₹2,500 to ₹3,500.</p>
      
      <p>Booking a self-drive car with <strong>Car Castle Goa</strong> ensures your car is fueled, sanitized, and parked ready in the arrival zone. You take the wheel and glide down the scenic Western Ghats foothills directly to your villa or resort.</p>
    `,
    faqs: [
      {
        q: "How far is Mopa Airport from Calangute and Baga?",
        a: "Mopa Airport is approximately 38 km from Calangute and Baga. The drive takes around 40 to 45 minutes via the Mopa Expressway and NH66."
      },
      {
        q: "Is there an extra charge for picking up a car at Mopa Airport?",
        a: "We provide free airport handover on bookings of 3 days or longer. For shorter rentals, a nominal airport logistics fee applies."
      },
      {
        q: "What types of cars are best suited for Mopa Airport arrivals?",
        a: "For families with luggage, the Toyota Innova Crysta, Maruti Ertiga, or Hyundai Creta are ideal. For couples traveling light, the Maruti Swift or i20 provides excellent fuel economy."
      }
    ]
  },
  {
    title: "Car Rental in Panjim Goa | Self Drive Cars from ₹1,500",
    description: "Self drive car rental in Panjim (Panaji), Goa. Doorstep delivery near Miramar, Fontainhas, and casinos. Clean fleet, transparent rates, 24/7 service.",
    slug: "panjim-car-rental",
    filename: "panjim-car-rental.html",
    h1: "Self-Drive Car Rental in Panjim (Panaji), Goa",
    areaName: "Panjim City",
    locality: "Panjim",
    geo: { lat: "15.4909", lng: "73.8278" },
    subtitle: "Pick up your self-drive car in Goa's historic capital. Perfect for visiting Fontainhas, Miramar Beach, and dining along the Mandovi river.",
    distances: [
      { to: "Miramar Beach & Dona Paula", dist: "4 km (10 mins)" },
      { to: "Old Goa Churches (Basilica)", dist: "10 km (15 mins via bypass)" },
      { to: "Calangute & Candolim", dist: "15 km (22 mins via Atal Setu)" },
      { to: "Dabolim Airport", dist: "28 km (35 mins via Zuari Bridge)" }
    ],
    localTips: [
      "Pay Parking in Panjim: Panjim Municipal Corporation enforces paid street parking across the commercial district. Look for marked municipal parking slots.",
      "Fontainhas Narrow Lanes: If staying in the Latin Quarter, compact hatchbacks like Swift or Baleno are strongly recommended.",
      "Mandovi River Cruises: Park at the multi-level car park near Santa Monica Jetty for river cruises and offshore casino access."
    ],
    contentHtml: `
      <h2>Explore Goa's Culture &amp; Heritage with Panjim Car Rental</h2>
      <p>As the cultural and administrative heart of Goa, <strong>Panjim (Panaji)</strong> blends colorful colonial Portuguese architecture in Fontainhas with riverfront promenades along the Mandovi River. Having a self-drive car in Panjim lets you comfortably explore Old Goa's UNESCO World Heritage churches, Dona Paula viewpoint, and waterfront dining without relying on local autos.</p>
      
      <p><strong>Car Castle Goa</strong> delivers vehicles right to your Panjim hotel, boutique homestay, or apartment within 30 minutes of booking confirmation.</p>
    `,
    faqs: [
      {
        q: "Do you offer doorstep car delivery to hotels in Panjim?",
        a: "Yes, we deliver cars directly to any hotel, Airbnb, or resort across Panjim, Miramar, Dona Paula, and Porvorim."
      },
      {
        q: "Which car is best for driving inside Panjim city?",
        a: "Compact automatic hatchbacks like the Maruti Baleno Alpha or Hyundai i20 are top choices for smooth navigation through Fontainhas and city shopping streets."
      },
      {
        q: "What is the driving speed limit in Panjim city?",
        a: "The speed limit within Panjim municipal city limits is 40 km/h, while coastal bridges like Atal Setu allow up to 60-80 km/h."
      }
    ]
  },
  {
    title: "Madgaon Railway Station Car Rental | Margao Self Drive",
    description: "Self drive car delivery at Madgaon (Margao) Railway Station (MAO). Meet-and-greet on arrival, affordable tariffs, no hidden costs. Book on WhatsApp!",
    slug: "madgaon-railway-station-car-rental",
    filename: "madgaon-railway-station-car-rental.html",
    h1: "Madgaon Railway Station (MAO) Car Rental Delivery",
    areaName: "Madgaon Railway Station",
    locality: "Margao",
    geo: { lat: "15.2736", lng: "73.9582" },
    subtitle: "Stepping off the train at Madgaon (MAO)? Get your self-drive car delivered directly to the station parking lot for an effortless South Goa vacation.",
    distances: [
      { to: "Colva & Benaulim Beaches", dist: "8 km (15 mins)" },
      { to: "Cavelossim & Mobor", dist: "18 km (25 mins)" },
      { to: "Palolem & Agonda Beach", dist: "38 km (50 mins via NH66)" },
      { to: "Panjim City", dist: "33 km (40 mins via NH66)" }
    ],
    localTips: [
      "Station Exit 1 (Main Platform): Our staff typically waits near the main circulating parking area outside Platform 1.",
      "South Goa Gateway: Madgaon is the primary rail gateway to South Goa's serene luxury resorts in Benaulim, Varca, and Majorda.",
      "NH66 Southbound: Driving south towards Palolem is a peaceful four-lane journey with scenic paddy fields."
    ],
    contentHtml: `
      <h2>Direct Train Handover at Madgaon Railway Junction</h2>
      <p><strong>Madgaon Junction (MAO)</strong> is Goa's busiest railway station, receiving superfast Rajdhani, Tejas, and Vande Bharat expresses from Mumbai, Bangalore, Delhi, and Kerala. Station taxi queues are often chaotic with inflated pricing for South Goa beach hotels.</p>
      
      <p>With <strong>Car Castle Goa</strong>, your rental car is waiting right in the station parking lot. As your train pulls in, simply step out, verify your digital agreement, load your luggage into your own boot, and drive straight to your beach cottage or resort.</p>
    `,
    faqs: [
      {
        q: "How does car pickup work when arriving by train at Madgaon station?",
        a: "Our representative tracks your train arrival time and parks the vehicle in the main station lot. We meet you outside the exit gate for a fast 3-minute handover."
      },
      {
        q: "Can I drop the car at an airport after picking it up at Madgaon railway station?",
        a: "Yes! You can pick up the car at Madgaon Railway Station and drop it off at either Dabolim Airport (GOI) or Mopa Airport (GOX) when leaving."
      },
      {
        q: "What documents do I need to show at the station for handover?",
        a: "A valid original Indian Driving License or International Driving Permit along with your Aadhaar or Passport copy."
      }
    ]
  },
  {
    title: "Calangute & Baga Car Rental Goa | Self Drive Beach Cars",
    description: "Rent self drive cars in Calangute and Baga beach area. Doorstep hotel & resort delivery, compact hatchbacks & Thar 4x4. Instant booking on WhatsApp!",
    slug: "calangute-baga-car-rental",
    filename: "calangute-baga-car-rental.html",
    h1: "Self-Drive Car Rental in Calangute & Baga Beach",
    areaName: "Calangute & Baga",
    locality: "Calangute",
    geo: { lat: "15.5439", lng: "73.7553" },
    subtitle: "Stay right in Goa's vibrant nightlife and beach hub. Reliable cars delivered directly to your resort lobby in Calangute, Baga, and Candolim.",
    distances: [
      { to: "Baga Tito's Lane", dist: "1.5 km (5 mins)" },
      { to: "Anjuna & Vagator", dist: "8 km (15 mins)" },
      { to: "Fort Aguada & Sinquerim", dist: "7 km (15 mins)" },
      { to: "Mopa Airport (GOX)", dist: "38 km (45 mins)" }
    ],
    localTips: [
      "Beach Road Congestion: Calangute-Baga road experiences heavy evening traffic. An automatic car (Swift, Baleno, Creta) provides effortless stop-and-go driving.",
      "Nightlife Parking: Dedicated paid parking spaces are available near Baga beach bridge and Calangute football ground.",
      "Thar 4x4 Beach Cruiser: The Mahindra Thar is the most popular vehicle choice for visitors exploring the Calangute-Vagator coastal strip."
    ],
    contentHtml: `
      <h2>The Heart of North Goa Beach Life</h2>
      <p><strong>Calangute and Baga</strong> are the most popular tourist destinations in Goa, packed with beach shacks, water sports, live music venues, and vibrant markets. Relying on local transport for dining out or visiting nearby Anjuna, Chapora, and Morjim gets expensive very quickly.</p>
      
      <p><strong>Car Castle Goa</strong> delivers sanitized, well-maintained self-drive cars right to your hotel or guest house in Calangute and Baga. Enjoy full air conditioning, private luggage security, and the flexibility to drive wherever the music takes you.</p>
    `,
    faqs: [
      {
        q: "Do you deliver cars directly to hotels in Calangute?",
        a: "Yes, we deliver cars directly to any hotel, resort, or villa across Calangute, Baga, Candolim, and Arpora at zero extra delivery charge on multi-day rentals."
      },
      {
        q: "What is the best car for Calangute traffic?",
        a: "Compact automatic hatchbacks (Maruti Swift or Baleno) or compact SUVs (Hyundai Creta) are best suited for handling beach lane traffic."
      },
      {
        q: "Can I book a Mahindra Thar in Calangute?",
        a: "Yes, our automatic Mahindra Thar 4x4 is frequently booked in Calangute and can be delivered right to your hotel."
      }
    ]
  },
  {
    title: "North Goa Car Rental | Self Drive Cars Candolim to Arambol",
    description: "Explore North Goa in style. Self drive car rentals delivered to Candolim, Anjuna, Vagator, Siolim & Morjim. Best prices, zero paperwork hassle.",
    slug: "north-goa-car-rental",
    filename: "north-goa-car-rental.html",
    h1: "Self-Drive Car Rental Services Across North Goa",
    areaName: "North Goa",
    locality: "North Goa District",
    geo: { lat: "15.5900", lng: "73.8100" },
    subtitle: "From buzzing beach clubs in Vagator to peaceful sunsets in Mandrem & Ashwem. Doorstep delivery across all North Goa beach towns.",
    distances: [
      { to: "Candolim & Sinquerim", dist: "Southern end of North Goa coastal belt" },
      { to: "Anjuna & Vagator", dist: "Central North Goa nightlife & cliffside cafes" },
      { to: "Siolim & Assagao", dist: "Trendy boutique villas & fine dining hub" },
      { to: "Morjim, Ashwem & Arambol", dist: "Pristine white sand beaches & surf spots" }
    ],
    localTips: [
      "Scenic Siolim-Chopdem Bridge: Take the coastal bridge route from Siolim into Morjim for stunning river-mouth scenery.",
      "Assagao Culinary Trail: Home to Goa's finest independent restaurants; book a car to hop effortlessly between evening venues.",
      "Beach Driving Prohibited: Driving vehicles onto beaches is strictly illegal across all of Goa with heavy fines and vehicle impoundment. Always park in designated parking lots."
    ],
    contentHtml: `
      <h2>Freedom to Explore Every Corner of North Goa</h2>
      <p>North Goa is famous for its eclectic energy &mdash; from world-class culinary experiences in Assagao and epic sunsets atop Vagator's red cliffs to the bohemian yoga vibe of Arambol. Having your own self-drive car is the only way to genuinely experience the variety North Goa has to offer.</p>
      
      <p><strong>Car Castle Goa</strong> provides comprehensive coverage across the entire North Goa district. Whether you need an economical hatchback for beach hopping or a luxury convertible for cruising the coastal roads, we bring the car right to your doorstep.</p>
    `,
    faqs: [
      {
        q: "Which North Goa areas do you deliver to?",
        a: "We deliver across Candolim, Calangute, Baga, Arpora, Anjuna, Vagator, Assagao, Siolim, Morjim, Ashwem, Mandrem, Arambol, Mapusa, and Porvorim."
      },
      {
        q: "What is the fuel policy in North Goa?",
        a: "We operate on a level-to-level fuel policy. We supply the car with a noted fuel level, and you simply return it with the same quantity."
      },
      {
        q: "Are the rental cars fully insured for self-drive in North Goa?",
        a: "Yes, every vehicle in our fleet carries full commercial insurance coverage, and our 24/7 support team is stationed nearby for instant assistance."
      }
    ]
  },
  {
    title: "South Goa Car Rental | Peaceful Beach Self Drive Cars",
    description: "Self drive car rentals in South Goa across Colva, Benaulim, Cavelossim & Palolem. Clean family cars & SUVs, transparent rates, doorstep handover.",
    slug: "south-goa-car-rental",
    filename: "south-goa-car-rental.html",
    h1: "Self-Drive Car Rental Services in South Goa",
    areaName: "South Goa",
    locality: "South Goa District",
    geo: { lat: "15.2000", lng: "74.0000" },
    subtitle: "Experience peaceful coastal roads, pristine white sands, ancient forts, and lush nature reserves with your personal self-drive vehicle.",
    distances: [
      { to: "Colva & Benaulim", dist: "Serene white sand beaches close to Margao" },
      { to: "Cavelossim & Mobor", dist: "Luxury 5-star resort strip (Leela, St. Regis)" },
      { to: "Cabo de Rama Fort", dist: "Breathtaking clifftop views overlooking the sea" },
      { to: "Palolem, Patnem & Agonda", dist: "Southern crescent beaches & dolphin cruises" }
    ],
    localTips: [
      "Relaxed Highway Driving: South Goa features wider, less congested four-lane highways ideal for leisurely road trips.",
      "Cabo de Rama Coastal Route: The winding cliff road down to Cabo de Rama Fort offers one of the most picturesque coastal drives in India.",
      "Family & Group MPVs: Because South Goa resort stays are often family-oriented, the Toyota Innova Crysta and Maruti Ertiga are our highest-rated vehicles for this region."
    ],
    contentHtml: `
      <h2>Discover the Untouched Beauty of South Goa</h2>
      <p>While North Goa is bustling and fast-paced, <strong>South Goa</strong> is a paradise of tranquility, sprawling luxury beach resorts, Portuguese heritage mansions in Chandor, and calm turquoise waters in Agonda and Palolem. Because tourist attractions and secluded beaches are spread out across 80 kilometers of coastline, having a self-drive car is an absolute necessity.</p>
      
      <p><strong>Car Castle Goa</strong> provides swift delivery to major South Goa hubs including Colva, Benaulim, Varca, Cavelossim, Majorda, Vasco da Gama, and Palolem. Enjoy total peace of mind with 24/7 roadside assistance anywhere in the south.</p>
    `,
    faqs: [
      {
        q: "Do you deliver self-drive cars to luxury resorts in Cavelossim and Mobor?",
        a: "Yes, we regularly deliver cars to luxury properties including The Leela, St. Regis, Holiday Inn, and ITC Grand Goa."
      },
      {
        q: "Can I drive a rental car down to Palolem and Cola Beach?",
        a: "Absolutely. All our self-drive cars are permitted throughout Goa and handle the scenic highway drive to Palolem with ease."
      },
      {
        q: "What documents do I need to rent a car in South Goa?",
        a: "Original valid Driving License and an Aadhaar Card or Passport. Digital confirmation is provided instantly via WhatsApp."
      }
    ]
  }
];

function generateLocationHTML(loc) {
  return `<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${loc.title}</title>
  <meta name="description" content="${loc.description}" />
  <link rel="canonical" href="https://carcastlegoa.com/locations/${loc.filename}" />
  <meta name="theme-color" content="#0f172a" />

  <!-- Verification Placeholders -->
  <meta name="google-site-verification" content="[YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE]" />
  <meta name="msvalidate.01" content="[YOUR_BING_VERIFICATION_CODE]" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://carcastlegoa.com/locations/${loc.filename}" />
  <meta property="og:title" content="${loc.title}" />
  <meta property="og:description" content="${loc.description}" />
  <meta property="og:image" content="https://carcastlegoa.com/images/hero_road.jpg" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${loc.title}" />
  <meta name="twitter:description" content="${loc.description}" />
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
            "name": "Locations",
            "item": "https://carcastlegoa.com/locations/${loc.filename}"
          }
        ]
      },
      {
        "@type": "AutoRental",
        "@id": "https://carcastlegoa.com/locations/${loc.filename}#business",
        "name": "Car Castle Rentals Goa - ${loc.areaName}",
        "url": "https://carcastlegoa.com/locations/${loc.filename}",
        "telephone": "+918767286682",
        "priceRange": "₹1,500 - ₹7,500/day",
        "image": "https://carcastlegoa.com/images/logo.png",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "${loc.locality}",
          "addressRegion": "Goa",
          "postalCode": "403001",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "${loc.geo.lat}",
          "longitude": "${loc.geo.lng}"
        },
        "areaServed": {
          "@type": "Place",
          "name": "${loc.areaName}"
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
            ],
            "opens": "00:00",
            "closes": "23:59"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": ${JSON.stringify(loc.faqs.map(f => ({
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
        <a href="https://wa.me/918767286682?text=Hi%20Car%20Castle%20Goa%2C%20I%20want%20to%20book%20a%20car%20in%20${encodeURIComponent(loc.areaName)}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp">Book via WhatsApp</a>
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
        <li class="breadcrumb-item">Locations</li>
        <li class="breadcrumb-separator">/</li>
        <li class="breadcrumb-item current" aria-current="page">${loc.areaName}</li>
      </ol>
    </div>
  </nav>

  <!-- Page Header -->
  <section class="section" style="background-color: var(--bg-light); padding-top: 3.5rem; padding-bottom: 2.5rem;">
    <div class="container" style="max-width: 900px; text-align: center;">
      <h1 class="section-title" style="margin-bottom: 0.75rem;">${loc.h1}</h1>
      <p class="section-subtitle" style="margin: 0 auto; max-width: 750px;">${loc.subtitle}</p>
    </div>
  </section>

  <!-- Content Section -->
  <main class="section">
    <div class="container" style="max-width: 900px;">

      <!-- Local Quick Facts / Distances -->
      <div class="quick-facts-box">
        <div class="quick-facts-header">
          <svg width="22" height="22" fill="none" stroke="var(--secondary)" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <h2 class="quick-facts-title">${loc.areaName} &mdash; Travel Distances &amp; Times</h2>
        </div>
        <div class="quick-facts-grid">
          ${loc.distances.map(d => `
            <div class="fact-item">
              <span class="fact-label">${d.to}</span>
              <span class="fact-val">${d.dist}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="article-content">
        ${loc.contentHtml}

        <h2>Local Driving Tips for ${loc.areaName}</h2>
        <ul>
          ${loc.localTips.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
      </div>

      <!-- FAQ Section -->
      <section style="margin-top: 3.5rem;">
        <h2 style="font-size: 1.65rem; font-weight: 700; color: var(--primary); margin-bottom: 1.25rem;">
          Frequently Asked Questions About Car Rental in ${loc.areaName}
        </h2>
        <div class="faq-container">
          ${loc.faqs.map(f => `
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
          <h3 class="review-prompt-title">Need a Car Delivered to ${loc.areaName}?</h3>
          <p class="review-prompt-desc">Connect with our local dispatch team on WhatsApp. Instant delivery confirmation, car photos, and zero paperwork hassle.</p>
        </div>
        <a href="https://wa.me/918767286682?text=Hi%20Car%20Castle%20Goa%2C%20I%20want%20to%20book%20a%20car%20delivered%20to%20${encodeURIComponent(loc.areaName)}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp" style="font-size: 1.05rem; padding: 0.85rem 1.75rem;">
          Book for ${loc.areaName}
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

const outDir = path.join(__dirname, '..', 'carcastlegoa', 'locations');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

locations.forEach(loc => {
  const filePath = path.join(outDir, loc.filename);
  fs.writeFileSync(filePath, generateLocationHTML(loc), 'utf8');
  console.log(`Generated Location: ${loc.filename}`);
});

console.log('All 7 Location landing pages generated successfully!');
