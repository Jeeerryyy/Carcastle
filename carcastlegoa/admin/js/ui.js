/**
 * Car Castle Goa - Admin UI Rendering Library
 * Flat, Utilitarian Business Software Components
 */

/**
 * Escape HTML to prevent XSS
 */
export function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Format car image source for admin panel (resolves relative image paths)
 */
export function formatCarImageSrc(imgSrc) {
  if (!imgSrc) return '../images/default-car.webp';
  if (imgSrc.startsWith('http://') || imgSrc.startsWith('https://') || imgSrc.startsWith('data:')) {
    return imgSrc;
  }
  if (imgSrc.startsWith('../')) {
    return imgSrc;
  }
  if (imgSrc.startsWith('/')) {
    return '..' + imgSrc;
  }
  return '../' + imgSrc;
}

/**
 * Simple, Discreet Toast Notification
 */
export function showToast(message, type = 'success', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
  toast.textContent = message;

  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));

  const dismiss = () => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
  };

  if (duration > 0) {
    setTimeout(dismiss, duration);
  }
}

/**
 * Render 4 Plain Metrics on Dashboard
 */
export function renderMetrics(cars) {
  const totalEl = document.getElementById('metric-total');
  const availableEl = document.getElementById('metric-available');
  const bookedEl = document.getElementById('metric-booked');
  const maintenanceEl = document.getElementById('metric-maintenance');

  if (!totalEl) return;

  const total = cars.length;
  const available = cars.filter(c => c.status === 'available').length;
  const booked = cars.filter(c => c.status === 'booked').length;
  const maintenance = cars.filter(c => c.status === 'maintenance').length;

  totalEl.textContent = total;
  availableEl.textContent = available;
  bookedEl.textContent = booked;
  maintenanceEl.textContent = maintenance;
}

/**
 * Render Recently Added 5 Cars on Dashboard
 */
export function renderRecentCars(cars, container, onEditCar) {
  if (!container) return;

  if (cars.length === 0) {
    container.innerHTML = `
      <div class="empty-box">
        <h3>No cars yet</h3>
        <p>Your fleet will appear here once you add cars.</p>
      </div>
    `;
    return;
  }

  // Take the 5 most recent cars
  const recent = [...cars].slice(0, 5);

  container.innerHTML = recent.map(car => {
    const rawThumb = (car.images && car.images[0]) || car.image;
    const thumb = formatCarImageSrc(rawThumb);
    const priceText = Number(car.pricePerDay || 0) > 0 
      ? `₹${Number(car.pricePerDay).toLocaleString('en-IN')}/day` 
      : (car.price ? `₹${car.price}/day` : '—');

    const statusMap = {
      available: { label: 'Available', cls: 'status-available' },
      booked: { label: 'Booked', cls: 'status-booked' },
      maintenance: { label: 'Maintenance', cls: 'status-maintenance' },
      hidden: { label: 'Hidden', cls: 'status-hidden' }
    };
    const s = statusMap[car.status] || statusMap.available;

    return `
      <div class="recent-item" data-car-id="${car.id}" title="Click to edit ${escapeHTML(car.name)}">
        <div class="recent-item-left">
          <img src="${escapeHTML(thumb)}" alt="" class="recent-thumb" onerror="this.onerror=null; this.src='../images/logo.png';" />
          <div>
            <div class="recent-name">${escapeHTML(car.name)}</div>
            <div class="recent-category">${escapeHTML(car.category || car.brand || 'Vehicle')}</div>
          </div>
        </div>
        <div class="recent-item-right">
          <span class="status-pill ${s.cls}">${s.label}</span>
          <div class="recent-price">${escapeHTML(priceText)}</div>
        </div>
      </div>
    `;
  }).join('');

  // Attach click handlers to navigate directly to edit form
  container.querySelectorAll('.recent-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.carId;
      const targetCar = cars.find(c => String(c.id) === String(id));
      if (targetCar && onEditCar) {
        onEditCar(targetCar);
      }
    });
  });
}

/**
 * Render All Cars Desktop Table
 */
export function renderCarsTable(cars, container, callbacks) {
  if (!container) return;

  if (cars.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-box">
            <h3>No cars found</h3>
            <p>No vehicles match your search or filter.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = cars.map(car => {
    const rawThumb = (car.images && car.images[0]) || car.image;
    const thumb = formatCarImageSrc(rawThumb);
    const priceText = Number(car.pricePerDay || 0) > 0 
      ? `₹${Number(car.pricePerDay).toLocaleString('en-IN')}` 
      : (car.price ? `₹${car.price}` : '—');

    const isAvailable = car.status === 'available';

    const statusMap = {
      available: { label: 'Available', cls: 'status-available' },
      booked: { label: 'Booked', cls: 'status-booked' },
      maintenance: { label: 'Maintenance', cls: 'status-maintenance' },
      hidden: { label: 'Hidden', cls: 'status-hidden' }
    };
    const s = statusMap[car.status] || statusMap.available;

    return `
      <tr data-car-id="${car.id}">
        <td>
          <img src="${escapeHTML(thumb)}" alt="" class="table-car-thumb" onerror="this.onerror=null; this.src='../images/logo.png';" />
        </td>
        <td>
          <span class="table-car-name" data-action="edit" title="Click to edit">${escapeHTML(car.name)}</span>
          <div style="font-size: 11px; color: var(--text-muted);">${escapeHTML(car.brand || '')}</div>
        </td>
        <td>
          <span>${escapeHTML(car.category || 'General')}</span>
        </td>
        <td>
          <span class="table-car-price">${escapeHTML(priceText)}</span>
          <span style="font-size: 11px; color: var(--text-muted);">/day</span>
        </td>
        <td>
          <span class="status-pill ${s.cls}">${s.label}</span>
        </td>
        <td style="text-align: right;">
          <div class="table-actions" style="justify-content: flex-end;">
            
            <!-- Available Switch -->
            <label class="switch-label" title="Toggle car availability">
              <input type="checkbox" class="switch-input" data-action="toggle-available" ${isAvailable ? 'checked' : ''} />
              <span class="switch-slider"></span>
              <span>Available</span>
            </label>

            <!-- Edit Button -->
            <button type="button" class="btn-action-text" data-action="edit">
              Edit
            </button>

            <!-- Delete Button -->
            <button type="button" class="btn-action-text btn-action-delete" data-action="delete">
              Delete
            </button>

          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Attach event delegations
  attachTableEventListeners(container, cars, callbacks);
}

/**
 * Event Delegation for Cars Table
 */
function attachTableEventListeners(container, cars, callbacks) {
  container.querySelectorAll('tr[data-car-id]').forEach(row => {
    const carId = row.dataset.carId;
    const car = cars.find(c => String(c.id) === String(carId));
    if (!car) return;

    // 1. Available Toggle Switch
    const switchInput = row.querySelector('[data-action="toggle-available"]');
    if (switchInput && callbacks.onToggleAvailable) {
      switchInput.addEventListener('change', (e) => {
        callbacks.onToggleAvailable(car, e.target.checked);
      });
    }

    // 2. Edit Action (via Edit button or Car Name click)
    row.querySelectorAll('[data-action="edit"]').forEach(el => {
      el.addEventListener('click', () => {
        if (callbacks.onEditCar) callbacks.onEditCar(car);
      });
    });

    // 3. Delete Action
    const deleteBtn = row.querySelector('[data-action="delete"]');
    if (deleteBtn && callbacks.onDeleteCar) {
      deleteBtn.addEventListener('click', () => {
        callbacks.onDeleteCar(car);
      });
    }
  });
}

/**
 * Render All Cars Mobile Cards
 */
export function renderCarsCards(cars, container, callbacks) {
  if (!container) return;

  if (cars.length === 0) {
    container.innerHTML = `
      <div class="empty-box">
        <h3>No cars found</h3>
        <p>No vehicles match your search or filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = cars.map(car => {
    const rawThumb = (car.images && car.images[0]) || car.image;
    const thumb = formatCarImageSrc(rawThumb);
    const priceText = Number(car.pricePerDay || 0) > 0 
      ? `₹${Number(car.pricePerDay).toLocaleString('en-IN')}` 
      : (car.price ? `₹${car.price}` : '—');

    const isAvailable = car.status === 'available';

    const statusMap = {
      available: { label: 'Available', cls: 'status-available' },
      booked: { label: 'Booked', cls: 'status-booked' },
      maintenance: { label: 'Maintenance', cls: 'status-maintenance' },
      hidden: { label: 'Hidden', cls: 'status-hidden' }
    };
    const s = statusMap[car.status] || statusMap.available;

    return `
      <div class="mobile-car-card" data-car-id="${car.id}">
        <div class="mobile-car-header">
          <img src="${escapeHTML(thumb)}" alt="" class="mobile-car-thumb" onerror="this.onerror=null; this.src='../images/logo.png';" />
          <div class="mobile-car-meta">
            <div class="mobile-car-title" data-action="edit">${escapeHTML(car.name)}</div>
            <div class="mobile-car-sub">${escapeHTML(car.category || 'General')} &bull; ${escapeHTML(car.brand || '')}</div>
          </div>
          <span class="status-pill ${s.cls}">${s.label}</span>
        </div>

        <div class="mobile-car-price-row">
          <span style="font-size: 13px; color: var(--text-muted);">Rate</span>
          <div class="mobile-car-price">${escapeHTML(priceText)} <span style="font-size: 12px; font-weight: 400; color: var(--text-muted);">/day</span></div>
        </div>

        <div class="mobile-car-actions-row">
          <label class="switch-label">
            <input type="checkbox" class="switch-input" data-action="toggle-available" ${isAvailable ? 'checked' : ''} />
            <span class="switch-slider"></span>
            <span>Available</span>
          </label>

          <div style="display: flex; gap: 8px;">
            <button type="button" class="btn-action-text" data-action="edit">Edit</button>
            <button type="button" class="btn-action-text btn-action-delete" data-action="delete">Delete</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach listeners
  container.querySelectorAll('.mobile-car-card').forEach(card => {
    const carId = card.dataset.carId;
    const car = cars.find(c => String(c.id) === String(carId));
    if (!car) return;

    const switchInput = card.querySelector('[data-action="toggle-available"]');
    if (switchInput && callbacks.onToggleAvailable) {
      switchInput.addEventListener('change', (e) => {
        callbacks.onToggleAvailable(car, e.target.checked);
      });
    }

    card.querySelectorAll('[data-action="edit"]').forEach(el => {
      el.addEventListener('click', () => {
        if (callbacks.onEditCar) callbacks.onEditCar(car);
      });
    });

    const deleteBtn = card.querySelector('[data-action="delete"]');
    if (deleteBtn && callbacks.onDeleteCar) {
      deleteBtn.addEventListener('click', () => {
        callbacks.onDeleteCar(car);
      });
    }
  });
}

/**
 * Render Photos in the Shared Form
 */
export function renderPhotoThumbnails(images, container, onSetCover, onRemove) {
  if (!container) return;

  if (!images || images.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 12px; font-size: 13px; color: var(--text-muted); text-align: center; border: 1px solid var(--border); border-radius: var(--radius-sm); background: #fafbfc;">
        No photos added yet. Upload files or enter image URLs above.
      </div>
    `;
    return;
  }

  container.innerHTML = images.map((url, idx) => {
    const isCover = idx === 0;
    const resolvedUrl = formatCarImageSrc(url);

    return `
      <div class="photo-card" data-index="${idx}">
        <img src="${escapeHTML(resolvedUrl)}" alt="Vehicle photo" class="photo-card-img" onerror="this.onerror=null; this.src='../images/logo.png';" />
        ${isCover ? '<span class="photo-cover-badge">Cover</span>' : ''}
        <div class="photo-card-actions">
          ${!isCover ? `<button type="button" class="btn-photo-action btn-set-cover" data-index="${idx}">Set Cover</button>` : '<span></span>'}
          <button type="button" class="btn-photo-action btn-photo-remove" data-index="${idx}">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  // Set Cover buttons
  container.querySelectorAll('.btn-set-cover').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      if (onSetCover) onSetCover(idx);
    });
  });

  // Remove buttons
  container.querySelectorAll('.btn-photo-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      if (onRemove) onRemove(idx);
    });
  });
}

/**
 * Render Design-Consistent Skeletons for Dashboard Recently Added List
 */
export function renderRecentCarsSkeleton(container, count = 5) {
  if (!container) return;
  container.innerHTML = Array(count).fill(0).map(() => `
    <div class="recent-item skeleton-item" aria-hidden="true">
      <div class="recent-item-left">
        <div class="skeleton-shimmer" style="width: 52px; height: 34px; border-radius: var(--radius-sm); flex-shrink: 0;"></div>
        <div>
          <div class="skeleton-shimmer skeleton-line" style="width: 140px; height: 14px; margin-bottom: 6px;"></div>
          <div class="skeleton-shimmer skeleton-line" style="width: 85px; height: 11px;"></div>
        </div>
      </div>
      <div class="recent-item-right">
        <div class="skeleton-shimmer" style="width: 68px; height: 20px; border-radius: 9999px;"></div>
        <div class="skeleton-shimmer skeleton-line" style="width: 72px; height: 14px;"></div>
      </div>
    </div>
  `).join('');
}

/**
 * Render Design-Consistent Skeletons for All Cars Table (Desktop)
 */
export function renderCarsTableSkeleton(container, count = 5) {
  if (!container) return;
  container.innerHTML = Array(count).fill(0).map(() => `
    <tr class="skeleton-table-row" aria-hidden="true">
      <td>
        <div class="skeleton-shimmer" style="width: 58px; height: 38px; border-radius: var(--radius-sm);"></div>
      </td>
      <td>
        <div class="skeleton-shimmer skeleton-line" style="width: 150px; height: 14px; margin-bottom: 6px;"></div>
        <div class="skeleton-shimmer skeleton-line" style="width: 90px; height: 11px;"></div>
      </td>
      <td>
        <div class="skeleton-shimmer skeleton-line" style="width: 75px; height: 13px;"></div>
      </td>
      <td>
        <div class="skeleton-shimmer skeleton-line" style="width: 65px; height: 14px;"></div>
      </td>
      <td>
        <div class="skeleton-shimmer" style="width: 72px; height: 20px; border-radius: 9999px;"></div>
      </td>
      <td style="text-align: right;">
        <div style="display: flex; gap: 8px; justify-content: flex-end; align-items: center;">
          <div class="skeleton-shimmer" style="width: 64px; height: 22px; border-radius: 9999px;"></div>
          <div class="skeleton-shimmer" style="width: 40px; height: 22px; border-radius: 4px;"></div>
          <div class="skeleton-shimmer" style="width: 44px; height: 22px; border-radius: 4px;"></div>
        </div>
      </td>
    </tr>
  `).join('');
}

/**
 * Render Design-Consistent Skeletons for All Cars Mobile Cards
 */
export function renderCarsCardsSkeleton(container, count = 4) {
  if (!container) return;
  container.innerHTML = Array(count).fill(0).map(() => `
    <div class="mobile-car-card skeleton-item" aria-hidden="true">
      <div class="mobile-car-header">
        <div class="skeleton-shimmer" style="width: 52px; height: 34px; border-radius: var(--radius-sm); flex-shrink: 0;"></div>
        <div class="mobile-car-meta">
          <div class="skeleton-shimmer skeleton-line" style="width: 130px; height: 14px; margin-bottom: 6px;"></div>
          <div class="skeleton-shimmer skeleton-line" style="width: 80px; height: 11px;"></div>
        </div>
        <div class="skeleton-shimmer" style="width: 68px; height: 20px; border-radius: 9999px;"></div>
      </div>
      <div class="mobile-car-price-row" style="margin-top: 10px;">
        <div class="skeleton-shimmer skeleton-line" style="width: 40px; height: 12px;"></div>
        <div class="skeleton-shimmer skeleton-line" style="width: 80px; height: 14px;"></div>
      </div>
      <div class="mobile-car-actions-row" style="margin-top: 10px;">
        <div class="skeleton-shimmer" style="width: 70px; height: 22px; border-radius: 9999px;"></div>
        <div style="display: flex; gap: 8px;">
          <div class="skeleton-shimmer" style="width: 36px; height: 24px; border-radius: 4px;"></div>
          <div class="skeleton-shimmer" style="width: 46px; height: 24px; border-radius: 4px;"></div>
        </div>
      </div>
    </div>
  `).join('');
}
