/**
 * Car Castle Goa - Admin Panel Controller
 * Handles view routing (Dashboard, All Cars, Shared Add/Edit Form),
 * live fleet subscriptions, form validation, and vehicle operations.
 */

import { requireAuth, logoutAdmin, getCurrentUser } from './auth.js?v=live-v4';
import {
  getSupabaseConfig,
  getCloudinaryConfig,
  saveSupabaseConfig,
  saveCloudinaryConfig,
  isSupabaseConfigured,
  autoDiscoverCloudConfig,
  testSupabaseConnection
} from './supabase-config.js?v=live-v4';
import {
  getLocalFallbackCars,
  subscribeCars,
  addCar,
  updateCar,
  deleteCar,
  seedCarsFromLocal,
  uploadImageToCloudinary
} from './db.js?v=live-v4';
import {
  renderMetrics,
  renderRecentCars,
  renderCarsTable,
  renderCarsCards,
  renderPhotoThumbnails,
  showToast
} from './ui.js?v=live-v4';

// Cleanup any legacy Firebase tokens/keys from previous versions
try {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('carcastle_firebase_config');
    localStorage.removeItem('carcastle_admin_demo_user');
  }
} catch (e) {}

// Application State
let allCars = [];
let filteredCars = [];
let activeView = 'dashboard';
let editingCarId = null;
let currentPhotos = [];
let isFormDirty = false;
let carPendingDelete = null;

// Filter State for "All Cars" screen
const filterState = {
  searchQuery: '',
  status: 'all'
};

/**
 * Boot Admin Application
 * Runs immediately if DOM is ready, or on DOMContentLoaded
 */
function bootAdmin() {
  // 0. Expose handlers immediately for inline onclick fast-paths
  window.adminAppSwitchView = switchView;
  window.adminAppResetForm = resetSharedForm;

  // 1. Immediately load fleet from cache/defaults & render initial view without waiting
  allCars = getLocalFallbackCars();
  renderMetrics(allCars);
  renderRecentCars(allCars, document.getElementById('dashboard-recent-list'), (car) => {
    openEditCarForm(car);
  });
  applyFiltersAndRenderCars();

  // 2. Bind Navigation & Action Events Immediately
  initNavigationEvents();
  initToolbarEvents();
  initSharedFormEvents();
  initModalEvents();

  // 3. Handle initial hash navigation
  handleHashNavigation();
  window.addEventListener('hashchange', handleHashNavigation);

  // 4. Warn before browser unload if form has unsaved edits
  window.addEventListener('beforeunload', (e) => {
    if (isFormDirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  // 5. Subscribe to fleet (for reactive updates and Firebase if configured)
  subscribeToFleet();

  // 6. Automatically discover cloud configuration from Vercel environment
  autoDiscoverCloudConfig().then(() => {
    // If Supabase was discovered, re-subscribe to pull cloud fleet
    if (isSupabaseConfigured()) {
      subscribeToFleet();
    }
  }).catch(() => {});

  // 7. Authenticate & load user session
  requireAuth((user) => {
    initAdminSession(user);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootAdmin);
} else {
  bootAdmin();
}

/**
 * Initialize Admin Session once authenticated
 */
function initAdminSession(user) {
  // Populate user profile info in sidebar
  const emailEl = document.getElementById('admin-user-email');
  const avatarEl = document.getElementById('admin-user-avatar');
  if (emailEl) {
    emailEl.textContent = (user && user.email) || 'carcastlegoa@gmail.com';
  }
  if (avatarEl) {
    const email = (user && user.email) || 'carcastlegoa@gmail.com';
    avatarEl.textContent = email.charAt(0).toUpperCase();
  }
}

/**
 * Realtime Subscription to Firestore / Local Storage
 */
function subscribeToFleet() {
  subscribeCars((cars) => {
    allCars = cars;
    
    // Update Dashboard Metrics & Recent list
    renderMetrics(allCars);
    renderRecentCars(allCars, document.getElementById('dashboard-recent-list'), (car) => {
      openEditCarForm(car);
    });

    // Update All Cars table & mobile cards
    applyFiltersAndRenderCars();
  }, (error) => {
    showToast("Error loading cars: " + error.message, "error");
  });
}

/**
 * View Routing & Navigation
 */
export function switchView(viewName, skipDirtyCheck = false) {
  if (!skipDirtyCheck && isFormDirty && activeView === 'add-car' && viewName !== 'add-car') {
    const confirmDiscard = window.confirm("You have unsaved changes on this car. Discard and leave?");
    if (!confirmDiscard) return;
    isFormDirty = false;
  }

  activeView = viewName;

  // 1. Update Sidebar Nav Active State
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    const itemTarget = item.getAttribute('data-view');
    if (itemTarget === viewName || (viewName === 'edit-car' && itemTarget === 'add-car')) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // 2. Hide all view sections, show target
  document.querySelectorAll('.admin-view').forEach(view => {
    view.classList.remove('active-view');
  });

  const titleEl = document.getElementById('page-header-title');
  const subEl = document.getElementById('page-header-sub');

  if (viewName === 'dashboard') {
    const dashEl = document.getElementById('view-dashboard');
    if (dashEl) dashEl.classList.add('active-view');
    if (titleEl) titleEl.textContent = 'Dashboard';
    if (subEl) subEl.textContent = 'Overview of your car rental fleet';
    try { history.replaceState(null, '', '#dashboard'); } catch (e) {}
    if (allCars.length > 0) {
      renderMetrics(allCars);
      renderRecentCars(allCars, document.getElementById('dashboard-recent-list'), (car) => {
        openEditCarForm(car);
      });
    }
  } else if (viewName === 'cars') {
    const carsEl = document.getElementById('view-cars');
    if (carsEl) carsEl.classList.add('active-view');
    if (titleEl) titleEl.textContent = 'All Cars';
    if (subEl) subEl.textContent = 'Manage vehicle availability, rates, and listings';
    try { history.replaceState(null, '', '#cars'); } catch (e) {}
    applyFiltersAndRenderCars();
  } else if (viewName === 'add-car') {
    const formEl = document.getElementById('view-car-form');
    if (formEl) formEl.classList.add('active-view');
    if (editingCarId) {
      if (titleEl) titleEl.textContent = 'Edit Car';
      if (subEl) subEl.textContent = 'Update vehicle details and pricing';
    } else {
      if (titleEl) titleEl.textContent = 'Add New Car';
      if (subEl) subEl.textContent = 'Add a vehicle to your rental fleet';
      try { history.replaceState(null, '', '#add-car'); } catch (e) {}
    }
  }

  // Close mobile sidebar if open
  closeMobileSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Expose switchView to global window for inline onclick handlers
window.adminAppSwitchView = switchView;
window.adminAppResetForm = resetSharedForm;

function handleHashNavigation() {
  const hash = (window.location.hash || '').replace('#', '').toLowerCase();
  if (hash === 'cars') {
    switchView('cars', true);
  } else if (hash === 'add-car') {
    if (!editingCarId) {
      resetSharedForm();
    }
    switchView('add-car', true);
  } else {
    switchView('dashboard', true);
  }
}

function initNavigationEvents() {
  // Sidebar navigation clicks
  document.getElementById('nav-dashboard').addEventListener('click', (e) => {
    e.preventDefault();
    switchView('dashboard');
  });

  document.getElementById('nav-cars').addEventListener('click', (e) => {
    e.preventDefault();
    switchView('cars');
  });

  document.getElementById('nav-add-car').addEventListener('click', (e) => {
    e.preventDefault();
    resetSharedForm();
    switchView('add-car');
  });

  // Shortcut buttons to switch views
  const viewAllBtn = document.getElementById('btn-view-all-from-dash');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => switchView('cars'));
  }

  const addFromListBtn = document.getElementById('btn-add-car-from-list');
  if (addFromListBtn) {
    addFromListBtn.addEventListener('click', () => {
      resetSharedForm();
      switchView('add-car');
    });
  }

  // Back button on form
  const cancelToListBtn = document.getElementById('btn-cancel-to-list');
  if (cancelToListBtn) {
    cancelToListBtn.addEventListener('click', () => switchView('cars'));
  }

  const formCancelBtn = document.getElementById('btn-form-cancel');
  if (formCancelBtn) {
    formCancelBtn.addEventListener('click', () => switchView('cars'));
  }

  // Logout button
  document.getElementById('btn-admin-logout').addEventListener('click', async () => {
    try {
      await logoutAdmin();
      window.location.replace('login.html');
    } catch (err) {
      showToast('Logout failed: ' + err.message, 'error');
    }
  });

  // Mobile menu toggle
  const mobileToggleBtn = document.getElementById('btn-toggle-mobile-menu');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', toggleMobileSidebar);
  }
  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeMobileSidebar);
  }
}

function toggleMobileSidebar() {
  const sidebar = document.getElementById('admin-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  sidebar.classList.toggle('mobile-open');
  backdrop.classList.toggle('mobile-open');
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('admin-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar) sidebar.classList.remove('mobile-open');
  if (backdrop) backdrop.classList.remove('mobile-open');
}

/**
 * Toolbar: Search & ONE Status Filter
 */
function initToolbarEvents() {
  const searchInput = document.getElementById('cars-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterState.searchQuery = e.target.value.trim().toLowerCase();
      applyFiltersAndRenderCars();
    });
  }

  const statusFilter = document.getElementById('cars-status-filter');
  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      filterState.status = e.target.value;
      applyFiltersAndRenderCars();
    });
  }
}

function applyFiltersAndRenderCars() {
  const { searchQuery, status } = filterState;

  filteredCars = allCars.filter(car => {
    // 1. Search Query filter (matches name, brand, category, fuel)
    if (searchQuery) {
      const name = (car.name || '').toLowerCase();
      const brand = (car.brand || '').toLowerCase();
      const cat = (car.category || '').toLowerCase();
      const fuel = (car.fuel || '').toLowerCase();
      if (!name.includes(searchQuery) && !brand.includes(searchQuery) && !cat.includes(searchQuery) && !fuel.includes(searchQuery)) {
        return false;
      }
    }

    // 2. Status filter
    if (status !== 'all') {
      if (car.status !== status) return false;
    }

    return true;
  });

  // Table on Desktop
  renderCarsTable(
    filteredCars,
    document.getElementById('cars-table-body'),
    {
      onToggleAvailable: handleToggleAvailable,
      onEditCar: openEditCarForm,
      onDeleteCar: promptDeleteCar
    }
  );

  // Cards on Mobile
  renderCarsCards(
    filteredCars,
    document.getElementById('cars-mobile-cards'),
    {
      onToggleAvailable: handleToggleAvailable,
      onEditCar: openEditCarForm,
      onDeleteCar: promptDeleteCar
    }
  );
}

/**
 * Action: Toggle Available Switch on / off
 */
async function handleToggleAvailable(car, isAvailableChecked) {
  const newStatus = isAvailableChecked ? 'available' : 'booked';
  try {
    await updateCar(car.id, { status: newStatus });
    showToast(isAvailableChecked ? `"${car.name}" marked as Available` : `"${car.name}" marked as Booked`);
  } catch (err) {
    showToast('Could not update status: ' + err.message, 'error');
    // Refresh table to revert state
    applyFiltersAndRenderCars();
  }
}

/**
 * Action: Prompt Delete Modal
 */
function promptDeleteCar(car) {
  carPendingDelete = car;
  const modal = document.getElementById('delete-modal-backdrop');
  if (modal) {
    modal.classList.add('is-open');
  }
}

function initModalEvents() {
  // Delete Modal cancel / confirm
  const cancelDeleteBtn = document.getElementById('btn-cancel-delete');
  const confirmDeleteBtn = document.getElementById('btn-confirm-delete');
  const deleteModal = document.getElementById('delete-modal-backdrop');

  if (cancelDeleteBtn && deleteModal) {
    cancelDeleteBtn.addEventListener('click', () => {
      deleteModal.classList.remove('is-open');
      carPendingDelete = null;
    });
  }

  if (confirmDeleteBtn && deleteModal) {
    confirmDeleteBtn.addEventListener('click', async () => {
      if (!carPendingDelete) return;
      const targetId = carPendingDelete.id;
      const carName = carPendingDelete.name;
      deleteModal.classList.remove('is-open');
      carPendingDelete = null;

      try {
        await deleteCar(targetId);
        showToast(`"${carName}" deleted`);
      } catch (err) {
        showToast('Delete failed: ' + err.message, 'error');
      }
    });
  }

  // Settings Modal (for Supabase & Cloudinary Keys & Fleet Sync)
  const settingsModal = document.getElementById('settings-modal-backdrop');
  const closeSettingsBtn = document.getElementById('btn-close-settings');
  const saveSettingsBtn = document.getElementById('btn-save-settings');
  const bannerSettingsBtn = document.getElementById('btn-banner-settings');
  const bannerSeedBtn = document.getElementById('btn-banner-seed');
  const modalSeedBtn = document.getElementById('btn-modal-seed-fleet');
  const testSupabaseBtn = document.getElementById('btn-test-supabase');
  const testStatusEl = document.getElementById('settings-test-status');

  const openSettings = async () => {
    if (settingsModal) {
      await autoDiscoverCloudConfig();
      const sbConfig = getSupabaseConfig();
      const cldConfig = getCloudinaryConfig();
      const urlInput = document.getElementById('settings-supabase-url');
      const keyInput = document.getElementById('settings-supabase-key');
      const cldNameInput = document.getElementById('settings-cloud-name');
      const cldPresetInput = document.getElementById('settings-upload-preset');

      if (urlInput) urlInput.value = sbConfig.url || '';
      if (keyInput) keyInput.value = sbConfig.anonKey || '';
      if (cldNameInput) cldNameInput.value = cldConfig.cloudName || '';
      if (cldPresetInput) cldPresetInput.value = cldConfig.uploadPreset || '';

      if (testStatusEl) {
        testStatusEl.style.display = 'none';
        testStatusEl.textContent = '';
      }
      settingsModal.classList.add('is-open');
    }
  };

  const openSettingsBtn = document.getElementById('btn-open-settings');
  if (openSettingsBtn) openSettingsBtn.addEventListener('click', openSettings);
  if (bannerSettingsBtn) bannerSettingsBtn.addEventListener('click', openSettings);
  if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', () => settingsModal.classList.remove('is-open'));

  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
      const url = document.getElementById('settings-supabase-url')?.value.trim() || '';
      const anonKey = document.getElementById('settings-supabase-key')?.value.trim() || '';
      const cloudName = document.getElementById('settings-cloud-name')?.value.trim() || '';
      const uploadPreset = document.getElementById('settings-upload-preset')?.value.trim() || '';

      saveSupabaseConfig(url, anonKey);
      saveCloudinaryConfig(cloudName, uploadPreset);

      showToast('Settings saved successfully!');
      setTimeout(() => {
        if (settingsModal) settingsModal.classList.remove('is-open');
        window.location.reload();
      }, 600);
    });
  }

  if (testSupabaseBtn) {
    testSupabaseBtn.addEventListener('click', async () => {
      const url = document.getElementById('settings-supabase-url')?.value.trim();
      const key = document.getElementById('settings-supabase-key')?.value.trim();
      if (!url || !key) {
        showToast('Please enter both Supabase URL and Anon Key', 'error');
        return;
      }
      if (testStatusEl) {
        testStatusEl.style.display = 'block';
        testStatusEl.style.color = 'var(--text-muted)';
        testStatusEl.textContent = 'Testing connection...';
      }
      const res = await testSupabaseConnection(url, key);
      if (testStatusEl) {
        if (res.ok || res.success) {
          testStatusEl.style.color = '#10b981';
          testStatusEl.textContent = 'Connected successfully to Supabase! (' + (res.message || 'cars table reachable') + ')';
        } else {
          testStatusEl.style.color = '#ef4444';
          testStatusEl.textContent = 'Connection test: ' + res.message;
        }
      }
    });
  }

  const runSeed = async () => {
    if (window.confirm("Sync all 11 default fleet cars into your active database (Supabase or Local Storage)?")) {
      try {
        showToast("Syncing fleet...");
        const count = await seedCarsFromLocal();
        showToast(`Successfully synced ${count} vehicles!`);
        if (settingsModal) settingsModal.classList.remove('is-open');
      } catch (err) {
        showToast("Sync failed: " + err.message, "error");
      }
    }
  };

  if (bannerSeedBtn) bannerSeedBtn.addEventListener('click', runSeed);
  if (modalSeedBtn) modalSeedBtn.addEventListener('click', runSeed);
}

/**
 * ============================================================================
 * SCREEN 3: ONE Shared Form for Add New Car & Edit Car
 * ============================================================================
 */
function resetSharedForm() {
  editingCarId = null;
  currentPhotos = [];
  isFormDirty = false;

  const form = document.getElementById('car-shared-form');
  if (form) form.reset();

  document.getElementById('form-screen-title').textContent = 'Add New Car';
  document.getElementById('form-screen-subtitle').textContent = 'Add a vehicle to your rental fleet';
  document.getElementById('btn-save-text').textContent = 'Save Car';

  // Clear validation styles
  form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  document.getElementById('group-price-day').classList.remove('is-invalid');
  document.getElementById('photo-validation-error').textContent = '';
  document.getElementById('photo-validation-error').style.display = 'none';

  // Default values
  document.getElementById('car-mileage').value = 'Unlimited km';
  document.getElementById('car-status').value = 'available';
  document.getElementById('car-featured').checked = false;

  renderFormPhotos();
}

function openEditCarForm(car) {
  resetSharedForm();

  editingCarId = car.id;
  document.getElementById('form-screen-title').textContent = 'Edit Car';
  document.getElementById('form-screen-subtitle').textContent = `Updating ${car.name}`;
  document.getElementById('btn-save-text').textContent = 'Save Car';

  // Populate Fields
  document.getElementById('car-name').value = car.name || '';
  document.getElementById('car-brand').value = car.brand || '';
  // Category normalization (supports legacy prem/reg tags and all body styles)
  let catVal = car.categoryType || car.category || 'SUV';
  if (catVal === 'prem') catVal = 'SUV';
  if (catVal === 'reg') catVal = 'Hatchback';
  if (catVal === 'MPV / 7-Seater') catVal = 'MPV';
  document.getElementById('car-category').value = catVal;

  document.getElementById('car-slug').value = car.slug || '';
  document.getElementById('car-price-day').value = car.pricePerDay || (car.price ? String(car.price).replace(/,/g, '') : '');
  document.getElementById('car-price-hour').value = car.pricePerHour || '';

  // Seats normalization
  let seatsVal = String(car.seats || '5 Seats');
  if (!seatsVal.includes('Seats')) seatsVal = `${seatsVal} Seats`;
  document.getElementById('car-seats').value = seatsVal;

  // Transmission normalization
  let transVal = String(car.transmission || 'Automatic');
  if (transVal.includes('4x4')) transVal = 'Automatic / 4x4';
  else if (transVal.includes('Auto') && transVal.includes('Manual')) transVal = 'Manual / Auto';
  else if (transVal.toLowerCase().includes('auto')) transVal = 'Automatic';
  else if (transVal.toLowerCase().includes('man')) transVal = 'Manual';
  document.getElementById('car-transmission').value = transVal;

  // Fuel normalization
  let fuelVal = String(car.fuel || 'Petrol');
  if (fuelVal.includes('Petrol') && fuelVal.includes('Diesel')) fuelVal = 'Petrol / Diesel';
  else if (fuelVal.includes('Petrol')) fuelVal = 'Petrol';
  else if (fuelVal.includes('Diesel')) fuelVal = 'Diesel';
  else if (fuelVal.includes('Electric')) fuelVal = 'Electric';
  else if (fuelVal.includes('CNG')) fuelVal = 'CNG';
  document.getElementById('car-fuel').value = fuelVal;
  document.getElementById('car-year').value = car.year || '';
  document.getElementById('car-mileage').value = car.mileage || 'Unlimited km';
  document.getElementById('car-ac').value = car.ac || 'Air Conditioning';
  document.getElementById('car-features-input').value = Array.isArray(car.features) ? car.features.join(', ') : '';
  document.getElementById('car-description').value = car.description || '';
  document.getElementById('car-status').value = car.status || 'available';
  document.getElementById('car-featured').checked = Boolean(car.featured);

  // Photos
  if (Array.isArray(car.images) && car.images.length > 0) {
    currentPhotos = [...car.images];
  } else if (car.image) {
    currentPhotos = [car.image];
  } else {
    currentPhotos = [];
  }
  renderFormPhotos();

  isFormDirty = false;
  switchView('add-car');
}

function renderFormPhotos() {
  const container = document.getElementById('form-photo-grid');
  renderPhotoThumbnails(
    currentPhotos,
    container,
    (index) => {
      // Set as Cover: move selected image to index 0
      const selected = currentPhotos.splice(index, 1)[0];
      currentPhotos.unshift(selected);
      isFormDirty = true;
      renderFormPhotos();
    },
    (index) => {
      // Remove photo
      currentPhotos.splice(index, 1);
      isFormDirty = true;
      renderFormPhotos();
    }
  );
}

function initSharedFormEvents() {
  const form = document.getElementById('car-shared-form');
  const fileInput = document.getElementById('car-photo-file-input');
  const dropZone = document.getElementById('photo-drop-zone');
  const addUrlBtn = document.getElementById('btn-add-photo-url');
  const urlInput = document.getElementById('car-photo-url-input');

  // Track user edits for unsaved changes guard
  form.addEventListener('input', () => {
    isFormDirty = true;
  });
  form.addEventListener('change', () => {
    isFormDirty = true;
  });

  // Inline Validation on Blur for Required Fields
  const validateField = (inputEl, containerEl = null) => {
    const val = inputEl.value ? inputEl.value.trim() : '';
    const target = containerEl || inputEl;
    if (!val) {
      target.classList.add('is-invalid');
      return false;
    } else {
      target.classList.remove('is-invalid');
      return true;
    }
  };

  document.getElementById('car-name').addEventListener('blur', (e) => validateField(e.target));
  document.getElementById('car-brand').addEventListener('blur', (e) => validateField(e.target));
  document.getElementById('car-category').addEventListener('blur', (e) => validateField(e.target));
  document.getElementById('car-seats').addEventListener('blur', (e) => validateField(e.target));
  document.getElementById('car-transmission').addEventListener('blur', (e) => validateField(e.target));
  document.getElementById('car-fuel').addEventListener('blur', (e) => validateField(e.target));
  document.getElementById('car-price-day').addEventListener('blur', (e) => {
    const val = parseFloat(e.target.value);
    const grp = document.getElementById('group-price-day');
    if (isNaN(val) || val <= 0) {
      grp.classList.add('is-invalid');
    } else {
      grp.classList.remove('is-invalid');
    }
  });

  // Photo URL input
  if (addUrlBtn && urlInput) {
    addUrlBtn.addEventListener('click', () => {
      const url = urlInput.value.trim();
      if (!url) return;
      currentPhotos.push(url);
      urlInput.value = '';
      isFormDirty = true;
      renderFormPhotos();
    });
  }

  // Photo File Input & Drag/Drop
  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      handleFilesUpload(e.target.files);
    });
  }

  if (dropZone) {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      if (e.dataTransfer && e.dataTransfer.files) {
        handleFilesUpload(e.dataTransfer.files);
      }
    });
  }

  // Form Submission
  form.addEventListener('submit', handleFormSubmit);
}

/**
 * Handle Photo Upload Files (Type & Size Validation)
 */
async function handleFilesUpload(files) {
  if (!files || files.length === 0) return;
  const errorEl = document.getElementById('photo-validation-error');
  errorEl.textContent = '';
  errorEl.style.display = 'none';

  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxBytes = 5 * 1024 * 1024; // 5MB

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!validTypes.includes(file.type)) {
      errorEl.textContent = `File "${file.name}" is not a supported image format. Please use JPG, PNG, or WebP.`;
      errorEl.style.display = 'block';
      return;
    }

    if (file.size > maxBytes) {
      errorEl.textContent = `File "${file.name}" is larger than 5MB. Please choose a smaller image.`;
      errorEl.style.display = 'block';
      return;
    }

    showToast(`Uploading ${file.name}...`);
    try {
      const uploadedUrl = await uploadImageToCloudinary(file);
      currentPhotos.push(uploadedUrl);
      isFormDirty = true;
      renderFormPhotos();
      showToast('Photo uploaded.');
    } catch (err) {
      errorEl.textContent = `Upload failed for "${file.name}": ${err.message}`;
      errorEl.style.display = 'block';
    }
  }
}

/**
 * Handle Form Submit (Add or Edit)
 */
async function handleFormSubmit(e) {
  e.preventDefault();

  const nameEl = document.getElementById('car-name');
  const brandEl = document.getElementById('car-brand');
  const categoryEl = document.getElementById('car-category');
  const priceDayEl = document.getElementById('car-price-day');
  const priceGroup = document.getElementById('group-price-day');
  const seatsEl = document.getElementById('car-seats');
  const transEl = document.getElementById('car-transmission');
  const fuelEl = document.getElementById('car-fuel');
  const statusEl = document.getElementById('car-status');

  // Validate all required fields
  let firstInvalid = null;

  const checkRequired = (inputEl, container = null) => {
    const val = inputEl.value ? inputEl.value.trim() : '';
    const target = container || inputEl;
    if (!val) {
      target.classList.add('is-invalid');
      if (!firstInvalid) firstInvalid = inputEl;
      return false;
    }
    target.classList.remove('is-invalid');
    return true;
  };

  checkRequired(nameEl);
  checkRequired(brandEl);
  checkRequired(categoryEl);
  checkRequired(seatsEl);
  checkRequired(transEl);
  checkRequired(fuelEl);

  const priceVal = parseFloat(priceDayEl.value);
  if (isNaN(priceVal) || priceVal <= 0) {
    priceGroup.classList.add('is-invalid');
    if (!firstInvalid) firstInvalid = priceDayEl;
  } else {
    priceGroup.classList.remove('is-invalid');
  }

  // Focus the first invalid field
  if (firstInvalid) {
    firstInvalid.focus();
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  // Build Payload
  const rawFeatures = document.getElementById('car-features-input').value;
  const featuresArray = rawFeatures
    ? rawFeatures.split(',').map(f => f.trim()).filter(Boolean)
    : [];

  const rawSlug = document.getElementById('car-slug').value.trim();
  const slug = rawSlug || nameEl.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const category = categoryEl.value;
  // Sedans, Hatchbacks, and affordable models under ₹2,500 belong to regular fleet
  const isRegular = category === 'Hatchback' || category === 'Sedan' || priceVal < 2500;
  const categoryGroup = isRegular ? 'reg' : 'prem';

  let categoryLabel = `${category} Rental`;
  if (category === 'Hatchback') categoryLabel = 'Popular Hatchback';
  else if (category === 'Sedan') categoryLabel = 'Executive Sedan';
  else if (category === 'SUV' && priceVal >= 3500) categoryLabel = 'Premium SUV';
  else if (category === 'MPV') categoryLabel = 'Spacious 7-Seater MPV';

  const coverImage = currentPhotos.length > 0 ? currentPhotos[0] : 'images/default-car.webp';

  const carData = {
    name: nameEl.value.trim(),
    brand: brandEl.value.trim(),
    category: category,
    categoryGroup: categoryGroup,
    categoryLabel: categoryLabel,
    slug: slug,
    url: `cars/${slug}.html`,
    pricePerDay: priceVal,
    price: priceVal.toLocaleString('en-IN'),
    pricePerHour: parseFloat(document.getElementById('car-price-hour').value) || 0,
    seats: seatsEl.value,
    transmission: transEl.value,
    fuel: fuelEl.value,
    year: parseInt(document.getElementById('car-year').value, 10) || new Date().getFullYear(),
    mileage: document.getElementById('car-mileage').value.trim() || 'Unlimited km',
    ac: document.getElementById('car-ac').value || 'Air Conditioning',
    features: featuresArray,
    description: document.getElementById('car-description').value.trim(),
    images: currentPhotos.length > 0 ? currentPhotos : [coverImage],
    image: coverImage,
    alt: `${nameEl.value.trim()} self drive car rental in Goa`,
    status: statusEl.value || 'available',
    featured: document.getElementById('car-featured').checked
  };

  // UI Button state
  const saveBtn = document.getElementById('btn-form-save');
  const spinner = document.getElementById('btn-save-spinner');
  const btnText = document.getElementById('btn-save-text');

  saveBtn.disabled = true;
  spinner.style.display = 'inline-block';
  btnText.textContent = 'Saving...';

  try {
    if (editingCarId) {
      await updateCar(editingCarId, carData);
      showToast('Car saved');
    } else {
      carData.order = allCars.length + 1;
      await addCar(carData);
      showToast('Car saved');
    }

    isFormDirty = false;
    resetSharedForm();

    // Reset search & status filters so the new/edited vehicle is immediately visible in All Cars
    const searchInput = document.getElementById('cars-search-input');
    if (searchInput) searchInput.value = '';
    const statusFilter = document.getElementById('cars-status-filter');
    if (statusFilter) statusFilter.value = 'all';
    filterState.searchQuery = '';
    filterState.status = 'all';

    switchView('cars');
  } catch (err) {
    console.error('Save error:', err);
    showToast('Failed to save car: ' + err.message, 'error');
  } finally {
    saveBtn.disabled = false;
    spinner.style.display = 'none';
    btnText.textContent = 'Save Car';
  }
}
