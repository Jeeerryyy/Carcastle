/**
 * Car Castle Goa - Core Client Interactions & Accessibility
 */
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Drawer Toggle & Focus Management
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    const toggleDrawer = (open) => {
      const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('open');
      mobileDrawer.classList.toggle('open', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      mobileDrawer.setAttribute('aria-hidden', String(!isOpen));

      if (isOpen) {
        // Focus first navigation link inside drawer
        const firstLink = mobileDrawer.querySelector('a, button');
        if (firstLink) firstLink.focus();
      } else {
        mobileToggle.focus();
      }
    };

    mobileToggle.addEventListener('click', () => toggleDrawer());

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        toggleDrawer(false);
      }
    });

    // Close drawer when clicking navigation links
    mobileDrawer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggleDrawer(false);
      });
    });
  }

  // Accessible FAQ Accordion Toggle
  const faqButtons = document.querySelectorAll('.faq-button');
  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const faqItem = button.closest('.faq-item');
      if (!faqItem) return;
      const isExpanded = faqItem.classList.contains('active');

      // Close other active items
      document.querySelectorAll('.faq-item.active').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
          const btn = item.querySelector('.faq-button');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle clicked item
      faqItem.classList.toggle('active', !isExpanded);
      button.setAttribute('aria-expanded', String(!isExpanded));
    });

    // Support keyboard activation via Enter / Space if not native button
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  });

  // Contact Form Submission with Standard Uniform WhatsApp Encoding
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name')?.value?.trim() || '';
      const phone = document.getElementById('phone')?.value?.trim() || '';
      const email = document.getElementById('email')?.value?.trim() || 'N/A';
      const message = document.getElementById('message')?.value?.trim() || 'N/A';

      const lines = [
        'Hi Car Castle, I want to book a car.',
        '',
        `*Name:* ${name || 'N/A'}`,
        `*Phone:* ${phone || 'N/A'}`,
        `*Email:* ${email}`,
        `*Message:* ${message}`
      ];

      const fullMessage = lines.join('\n');
      const whatsappUrl = `https://wa.me/918767286682?text=${encodeURIComponent(fullMessage)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // Live Vehicle Detail Page Dynamic Synchronizer
  const path = window.location.pathname;
  if (path.includes('/cars/') && !path.includes('/all-cars.html') && !path.includes('/reg-cars.html') && !path.includes('/prem-cars.html')) {
    const slug = path.split('/').pop().replace('.html', '');
    
    function applyDetailUpdates(fleet) {
      if (!Array.isArray(fleet) || !slug) return;
      const car = fleet.find(c => c.slug === slug || String(c.id) === slug);
      if (!car) return;

      const priceNum = Number(car.pricePerDay || (typeof car.price === 'string' ? car.price.replace(/,/g, '') : car.price) || 0);
      const formattedPrice = priceNum > 0 ? priceNum.toLocaleString('en-IN') : (car.price || '');
      if (!formattedPrice) return;

      // Update Quick Facts Tariff
      document.querySelectorAll('.quick-facts-grid .fact-item').forEach(item => {
        const label = item.querySelector('.fact-label');
        if (label && label.textContent.toLowerCase().includes('tariff')) {
          const val = item.querySelector('.fact-val');
          if (val) val.textContent = `₹${formattedPrice} / 24 Hours`;
        }
      });

      // Update Sidebar Daily Rate
      const sidebarRateContainer = document.querySelector('.car-booking-sidebar div[style*="font-size: 2rem"]');
      if (sidebarRateContainer) {
        sidebarRateContainer.innerHTML = `₹${formattedPrice} <span style="font-size: 0.95rem; font-weight: 500; color: var(--text-muted);">/ day</span>`;
      }

      // Update WhatsApp Booking CTA Link
      const waBtn = document.querySelector('.car-action-btn[data-track-car]');
      if (waBtn) {
        const carName = car.name || waBtn.getAttribute('data-track-car') || 'Car';
        const updatedMsg = `Hi Car Castle Goa, I want to book the ${carName} (₹${formattedPrice}/day) for my Goa trip. Please confirm availability!`;
        waBtn.href = `https://wa.me/918767286682?text=${encodeURIComponent(updatedMsg)}`;
      }
    }

    // 1. Initial local cache check
    try {
      const cached = localStorage.getItem('carcastle_local_cars');
      if (cached) applyDetailUpdates(JSON.parse(cached));
    } catch (e) {}

    // 2. Initial server fetch
    try {
      if (typeof fetch === 'function') {
        fetch('/api/cars')
          .then(r => r.ok ? r.json() : null)
          .then(fleet => { if (fleet) applyDetailUpdates(fleet); })
          .catch(() => {});
      }
    } catch (e) {}

    // 3. BroadcastChannel listener
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('carcastle_fleet_sync');
        bc.onmessage = (event) => {
          if (event.data && Array.isArray(event.data.fleet)) {
            applyDetailUpdates(event.data.fleet);
          }
        };
      } catch (e) {}
    }

    // 4. SSE Stream listener
    if (typeof EventSource !== 'undefined') {
      try {
        const sse = new EventSource('/api/cars/stream');
        sse.addEventListener('fleet', (e) => {
          try {
            const parsed = JSON.parse(e.data);
            if (Array.isArray(parsed)) applyDetailUpdates(parsed);
          } catch (err) {}
        });
      } catch (e) {}
    }
  }
});
