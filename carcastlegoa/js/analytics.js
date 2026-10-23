/**
 * Car Castle Goa - Analytics & Conversion Tracking (GA4 & Webmaster)
 * Tracks high-value business actions: WhatsApp inquiries, phone calls, form submissions, and car views.
 */

(function () {
  'use strict';

  // --- Configuration Placeholders (Replace with your actual keys) ---
  const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with real GA4 Measurement ID
  const GSC_VERIFICATION_CODE = ''; // Or supply via <meta name="google-site-verification" content="..." />
  const BING_VERIFICATION_CODE = ''; // Or supply via <meta name="msvalidate.01" content="..." />

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  // Load GA4 script dynamically if measurement ID is configured
  if (GA4_MEASUREMENT_ID && GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    gtag('js', new Date());
    gtag('config', GA4_MEASUREMENT_ID, {
      send_page_view: true,
      currency: 'INR'
    });
  }

  /**
   * Helper to dispatch custom events safely
   */
  function trackEvent(eventName, eventParams) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventParams);
    }
    // Also push to standard dataLayer for GTM compatibility
    window.dataLayer.push({
      event: eventName,
      ...eventParams
    });
  }

  // --- Attach DOM Event Listeners upon load ---
  document.addEventListener('DOMContentLoaded', () => {
    // 1. WhatsApp Click Tracking
    document.querySelectorAll('a[href*="wa.me"], .btn-whatsapp, .car-action-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const carName = this.getAttribute('data-track-car') || this.closest('.car-card')?.querySelector('.car-name')?.textContent || 'General';
        trackEvent('whatsapp_click', {
          event_category: 'engagement',
          event_label: carName,
          lead_source: window.location.pathname
        });
      });
    });

    // 2. Phone Call Click Tracking
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      link.addEventListener('click', function () {
        trackEvent('phone_call_click', {
          event_category: 'engagement',
          phone_number: this.getAttribute('href').replace('tel:', ''),
          page_location: window.location.pathname
        });
      });
    });

    // 3. Form Submission Tracking (Contact / Inquiry Form)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function () {
        trackEvent('form_submission', {
          event_category: 'lead',
          form_name: 'contact_enquiry',
          page_location: window.location.pathname
        });
      });
    }

    // 4. Car Specs / Detail Click Tracking
    document.querySelectorAll('a[href^="cars/"]').forEach(carLink => {
      carLink.addEventListener('click', function () {
        const carName = this.getAttribute('title') || this.textContent.trim();
        trackEvent('select_item', {
          item_category: 'car_rental',
          item_name: carName,
          page_location: window.location.pathname
        });
      });
    });
  });
})();
