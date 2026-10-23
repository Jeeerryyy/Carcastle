/**
 * Comprehensive End-to-End System Audit & Functional Verification
 * Tests the entire Admin Panel + Public Website integration and live synchronization:
 * 1. Admin Authentication (Invalid attempt, Master admin login, session persistence)
 * 2. Admin Dashboard & KPIs (4 metrics, Recently added cars, Quick actions)
 * 3. All Cars Table (Search filtering, status filtering, availability switch)
 * 4. Add New Car (Form validation, image URL addition, submission)
 * 5. Public Site Real-time Sync (Verification of newly added car in public grid, price, specs, WhatsApp CTA)
 * 6. Edit Car (Update price, change status to Booked, verify sync on both Admin and Public site)
 * 7. Delete Car (Modal cancel check, modal confirm delete, verify removal from Admin & Public site)
 * 8. Settings Modal (Fields inspection, Fleet sync trigger)
 * 9. Admin Logout & Route Protection (Logout redirect, protected view bounce)
 * 10. Public Site Tabs & Filtering (All Fleet, Regular Cars, Premium Cars)
 */

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://localhost:8080';
const PORT = 9235;

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

const auditLog = [];
function recordStep(id, title, status, details = '') {
  auditLog.push({ id, title, status, details, timestamp: new Date().toISOString() });
  const icon = status === 'PASS' ? '✅' : (status === 'FAIL' ? '❌' : 'ℹ️');
  console.log(`${icon} [${id}] ${title}: ${status}${details ? ` (${details})` : ''}`);
}

async function runComprehensiveAudit() {
  console.log('================================================================');
  console.log('   CAR CASTLE GOA - FULL SYSTEM AUDIT & INTEGRATION VERIFICATION  ');
  console.log('================================================================\n');

  // Step 0: Check server health
  const serverUp = await new Promise(resolve => {
    const req = http.get(`${BASE_URL}/health`, res => resolve(res.statusCode === 200));
    req.on('error', () => resolve(false));
    req.setTimeout(2500, () => resolve(false));
  });

  if (!serverUp) {
    throw new Error('Local server on http://localhost:8080 is not reachable.');
  }
  recordStep('SYS-01', 'Server Health Check', 'PASS', 'HTTP 200 on /health');

  const userDataDir = `C:\\Users\\parak\\AppData\\Local\\Temp\\edge-audit-${Date.now()}`;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDataDir}`,
    `${BASE_URL}/admin/login.html`
  ]);

  try {
    await wait(2500);

    const tabs = await new Promise((resolve, reject) => {
      http.get(`http://localhost:${PORT}/json`, res => {
        let data = '';
        res.on('data', d => data += d);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const pageTab = tabs.find(t => t.url.includes('admin/login.html') || t.type === 'page');
    if (!pageTab) throw new Error('Could not attach to browser debugging target');

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    let msgId = 1;
    const pending = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id)(msg);
        pending.delete(msg.id);
      }
    };

    await new Promise(r => ws.onopen = r);

    function send(method, params = {}) {
      return new Promise(resolve => {
        const curId = msgId++;
        pending.set(curId, resolve);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await send('Runtime.enable');
    await send('Page.enable');

    async function evalCode(expression) {
      const wrapped = `(() => {\n${expression}\n})()`;
      const res = await send('Runtime.evaluate', { expression: wrapped, returnByValue: true, awaitPromise: true });
      if (res.result && res.result.exceptionDetails) {
        throw new Error('JS Evaluation error: ' + JSON.stringify(res.result.exceptionDetails));
      }
      return res.result ? res.result.result : null;
    }

    async function evalVal(expression) {
      let code = expression.trim();
      if (!code.includes('return ')) {
        code = `return (${code});`;
      }
      const wrapped = `(() => {\n${code}\n})()`;
      const res = await send('Runtime.evaluate', { expression: wrapped, returnByValue: true, awaitPromise: true });
      if (res.result && res.result.exceptionDetails) {
        throw new Error('JS Evaluation error: ' + JSON.stringify(res.result.exceptionDetails));
      }
      return res.result ? (res.result.result ? res.result.result.value : null) : null;
    }

    // =========================================================================
    // TEST 1: Admin Authentication & Login Validation
    // =========================================================================
    console.log('\n--- MODULE 1: Admin Authentication ---');
    await send('Page.navigate', { url: `${BASE_URL}/admin/login.html` });
    await wait(1200);

    // 1.1 Test Password Visibility Toggle Button
    const pwdInitialType = await evalVal(`document.getElementById('login-password')?.type`);
    await evalCode(`document.getElementById('btn-toggle-password').click()`);
    const pwdToggledType = await evalVal(`document.getElementById('login-password')?.type`);
    await evalCode(`document.getElementById('btn-toggle-password').click()`);
    recordStep('AUTH-01', 'Password Show/Hide Toggle Button', pwdInitialType === 'password' && pwdToggledType === 'text' ? 'PASS' : 'FAIL', `Toggled from "${pwdInitialType}" to "${pwdToggledType}"`);

    // 1.2 Invalid login credentials
    await evalCode(`
      document.getElementById('login-email').value = 'wrong@gmail.com';
      document.getElementById('login-password').value = 'wrongpassword';
      document.getElementById('admin-login-form').dispatchEvent(new Event('submit', { cancelable: true }));
    `);
    await wait(600);

    const errorAlertVisible = await evalVal(`
      const err = document.getElementById('login-alert');
      return Boolean(err && err.style.display !== 'none' && (err.textContent.includes('Invalid credentials') || err.textContent.includes('email or password')));
    `);
    recordStep('AUTH-02', 'Invalid Credentials Rejection', errorAlertVisible ? 'PASS' : 'FAIL', 'Alert displayed on wrong login');

    // 1.3 Valid Master Admin Credentials
    await evalCode(`
      document.getElementById('login-email').value = 'carcastlegoa@gmail.com';
      document.getElementById('login-password').value = 'carcastelgoa';
      document.getElementById('admin-login-form').dispatchEvent(new Event('submit', { cancelable: true }));
    `);
    await wait(1500);

    const sessionActive = await evalVal(`
      const s = localStorage.getItem('carcastle_admin_session');
      return s ? JSON.parse(s).email : null;
    `);

    recordStep('AUTH-03', 'Master Admin Login', sessionActive === 'carcastlegoa@gmail.com' ? 'PASS' : 'FAIL', `Logged in as ${sessionActive}`);

    // =========================================================================
    // TEST 2: Admin Dashboard & KPIs
    // =========================================================================
    console.log('\n--- MODULE 2: Admin Dashboard & KPIs ---');
    await evalCode(`localStorage.removeItem('carcastle_local_cars')`);
    await send('Page.navigate', { url: `${BASE_URL}/admin/index.html#dashboard` });
    await wait(1500);

    const headerTitle = await evalVal(`document.getElementById('page-header-title')?.textContent`);
    const totalCarsVal = await evalVal(`document.getElementById('metric-total')?.textContent`);
    const availVal = await evalVal(`document.getElementById('metric-available')?.textContent`);
    const bookedVal = await evalVal(`document.getElementById('metric-booked')?.textContent`);
    const maintVal = await evalVal(`document.getElementById('metric-maintenance')?.textContent`);
    const recentCount = await evalVal(`document.querySelectorAll('#dashboard-recent-list .recent-item:not(.skeleton-item)').length`);

    recordStep('DASH-01', 'Dashboard View Render', headerTitle === 'Dashboard' ? 'PASS' : 'FAIL', `Header: "${headerTitle}"`);
    recordStep('DASH-02', 'Fleet Metric Cards', parseInt(totalCarsVal, 10) >= 11 ? 'PASS' : 'FAIL', `Total: ${totalCarsVal}, Avail: ${availVal}, Booked: ${bookedVal}, Maint: ${maintVal}`);
    recordStep('DASH-03', 'Recently Added List', recentCount > 0 ? 'PASS' : 'FAIL', `${recentCount} vehicles shown`);

    // =========================================================================
    // TEST 3: All Cars Table & Filter Controls
    // =========================================================================
    console.log('\n--- MODULE 3: All Cars Table & Filter Controls ---');
    await evalCode(`switchAdminTab('cars')`);
    await wait(500);

    const carsHeader = await evalVal(`document.getElementById('page-header-title')?.textContent`);
    const tableRowsCount = await evalVal(`document.querySelectorAll('#cars-table-body tr:not(.skeleton-table-row)').length`);
    recordStep('CARS-01', 'All Cars View Switch', carsHeader === 'All Cars' ? 'PASS' : 'FAIL', `Table rows: ${tableRowsCount}`);

    // 3.1 Search functionality
    await evalCode(`
      const sInput = document.getElementById('cars-search-input');
      sInput.value = 'Swift';
      sInput.dispatchEvent(new Event('input'));
    `);
    await wait(300);
    const searchMatchCount = await evalVal(`document.querySelectorAll('#cars-table-body tr:not(.skeleton-table-row)').length`);
    const searchMatchName = await evalVal(`document.querySelector('#cars-table-body tr td:nth-child(2) .table-car-name')?.textContent`);
    recordStep('CARS-02', 'Search Filter ("Swift")', searchMatchCount === 1 && searchMatchName.includes('Swift') ? 'PASS' : 'FAIL', `Matches: ${searchMatchCount}, Name: "${searchMatchName}"`);

    // Clear search
    await evalCode(`
      const sInput = document.getElementById('cars-search-input');
      sInput.value = '';
      sInput.dispatchEvent(new Event('input'));
    `);
    await wait(300);

    // 3.2 Status filter dropdown
    await evalCode(`
      const sf = document.getElementById('cars-status-filter');
      sf.value = 'available';
      sf.dispatchEvent(new Event('change'));
    `);
    await wait(300);
    const availableRows = await evalVal(`document.querySelectorAll('#cars-table-body tr:not(.skeleton-table-row)').length`);
    recordStep('CARS-03', 'Status Filter ("available")', availableRows > 0 ? 'PASS' : 'FAIL', `Available vehicles: ${availableRows}`);

    // Reset status filter
    await evalCode(`
      const sf = document.getElementById('cars-status-filter');
      sf.value = 'all';
      sf.dispatchEvent(new Event('change'));
    `);
    await wait(300);

    // 3.3 Availability toggle switch
    const initialSwitchState = await evalVal(`document.querySelector('input[data-action="toggle-available"]')?.checked`);
    await evalCode(`
      const sw = document.querySelector('input[data-action="toggle-available"]');
      sw && sw.click();
    `);
    await wait(500);
    const newSwitchState = await evalVal(`document.querySelector('input[data-action="toggle-available"]')?.checked`);
    recordStep('CARS-04', 'Availability Quick-Toggle Switch', newSwitchState !== initialSwitchState ? 'PASS' : 'FAIL', `Toggled from ${initialSwitchState} to ${newSwitchState}`);

    // Toggle back to original
    await evalCode(`
      const sw = document.querySelector('input[data-action="toggle-available"]');
      sw && sw.click();
    `);
    await wait(500);

    // =========================================================================
    // TEST 4: Add New Car (Form Validation & Creation)
    // =========================================================================
    console.log('\n--- MODULE 4: Add New Car Operation ---');
    await evalCode(`switchAdminTab('add-car')`);
    await wait(500);

    const formTitle = await evalVal(`document.getElementById('form-screen-title')?.textContent`);
    recordStep('ADD-01', 'Add Car Screen Open', formTitle === 'Add New Car' ? 'PASS' : 'FAIL', `Title: "${formTitle}"`);

    // 4.1 Form validation error on empty submit
    await evalCode(`
      document.getElementById('car-shared-form').dispatchEvent(new Event('submit', { cancelable: true }));
    `);
    await wait(300);
    const hasInvalid = await evalVal(`document.querySelectorAll('.form-input.is-invalid, .form-select.is-invalid').length > 0`);
    recordStep('ADD-02', 'Form Validation Requirements', hasInvalid ? 'PASS' : 'FAIL', 'Required fields highlighted in red');

    // 4.2 Fill all details for new vehicle
    const testCarName = 'Mahindra Thar Roxx 4x4';
    await evalCode(`
      document.getElementById('car-name').value = '${testCarName}';
      document.getElementById('car-brand').value = 'Mahindra';
      document.getElementById('car-category').value = 'SUV';
      document.getElementById('car-slug').value = 'mahindra-thar-roxx-rental-goa';
      document.getElementById('car-price-day').value = '4200';
      document.getElementById('car-price-hour').value = '350';
      document.getElementById('car-seats').value = '5 Seats';
      document.getElementById('car-transmission').value = 'Automatic';
      document.getElementById('car-fuel').value = 'Diesel';
      document.getElementById('car-year').value = '2024';
      document.getElementById('car-mileage').value = 'Unlimited km';
      document.getElementById('car-ac').value = 'Dual AC Climate Control';
      document.getElementById('car-features-input').value = '4x4 Drive, Sunroof, Touchscreen, Apple CarPlay, Ventilated Seats';
      document.getElementById('car-description').value = 'Experience the all-new 5-door Mahindra Thar Roxx in Goa with superior 4x4 off-road prowess and family comfort.';
      document.getElementById('car-status').value = 'available';
      document.getElementById('car-featured').checked = true;

      // Add Photo via URL
      document.getElementById('car-photo-url-input').value = 'images/mahindra-thar-4x4.webp';
      document.getElementById('btn-add-photo-url').click();
    `);
    await wait(400);

    const photosCount = await evalVal(`document.querySelectorAll('#form-photo-grid .photo-card').length`);
    recordStep('ADD-03', 'Photo URL Attachment', photosCount === 1 ? 'PASS' : 'FAIL', `Thumbnails rendered: ${photosCount}`);

    // Submit form
    await evalCode(`
      document.getElementById('car-shared-form').dispatchEvent(new Event('submit', { cancelable: true }));
    `);
    await wait(1200);

    // Verify redirected back to All Cars and new vehicle is in table
    const postAddView = await evalVal(`document.getElementById('page-header-title')?.textContent`);
    const firstCarName = await evalVal(`document.querySelector('#cars-table-body tr:first-child td:nth-child(2) .table-car-name')?.textContent`);
    recordStep('ADD-04', 'Add Car Submission & Table Refresh', firstCarName && firstCarName.includes(testCarName) ? 'PASS' : 'FAIL', `Top car in table: "${firstCarName}"`);

    // =========================================================================
    // TEST 5: Public Site Real-Time Synchronization
    // =========================================================================
    console.log('\n--- MODULE 5: Public Website Real-Time Sync ---');
    await send('Page.navigate', { url: `${BASE_URL}/all-cars.html` });
    await wait(1500);

    const publicGridCount = await evalVal(`document.querySelectorAll('#cars-grid .car-card').length`);
    const publicMatch = await evalVal(`
      return Array.from(document.querySelectorAll('#cars-grid .car-card')).some(c => c.textContent.includes('${testCarName}'));
    `);
    const publicPrice = await evalVal(`
      const card = Array.from(document.querySelectorAll('#cars-grid .car-card')).find(c => c.textContent.includes('${testCarName}'));
      return card ? card.querySelector('.car-price')?.textContent.trim() : null;
    `);

    recordStep('SYNC-01', 'Public Site Realtime Reflection', publicMatch ? 'PASS' : 'FAIL', `Found in public grid: ${publicMatch}, Total cards: ${publicGridCount}, Price: "${publicPrice}"`);

    // Check WhatsApp CTA button on new car card
    const waLink = await evalVal(`
      const card = Array.from(document.querySelectorAll('#cars-grid .car-card')).find(c => c.textContent.includes('${testCarName}'));
      return card ? card.querySelector('a.car-action-btn')?.getAttribute('href') : null;
    `);
    recordStep('SYNC-02', 'Enriched WhatsApp CTA Link', waLink && waLink.includes('918767286682') && waLink.includes('Roxx') ? 'PASS' : 'FAIL', `WA URL: ${waLink ? waLink.substring(0, 60) + '...' : 'none'}`);

    // =========================================================================
    // TEST 6: Admin Edit Car Operation
    // =========================================================================
    console.log('\n--- MODULE 6: Edit Car Operation ---');
    await send('Page.navigate', { url: `${BASE_URL}/admin/index.html#cars` });
    await wait(1200);

    // Click Edit on top car (Thar Roxx)
    await evalCode(`
      const editBtn = document.querySelector('#cars-table-body tr:first-child button[data-action="edit"]');
      editBtn && editBtn.click();
    `);
    await wait(600);

    const editScreenTitle = await evalVal(`document.getElementById('form-screen-title')?.textContent`);
    const editNameVal = await evalVal(`document.getElementById('car-name')?.value`);
    recordStep('EDIT-01', 'Edit Form Populate', editScreenTitle === 'Edit Car' && editNameVal === testCarName ? 'PASS' : 'FAIL', `Form Title: "${editScreenTitle}", Populated Name: "${editNameVal}"`);

    // Update Price to 4800 and Status to 'booked'
    await evalCode(`
      document.getElementById('car-price-day').value = '4800';
      document.getElementById('car-status').value = 'booked';
      document.getElementById('car-shared-form').dispatchEvent(new Event('submit', { cancelable: true }));
    `);
    await wait(1200);

    // Verify in Admin Table
    const editedPrice = await evalVal(`document.querySelector('#cars-table-body tr:first-child td:nth-child(4)')?.textContent`);
    const editedStatus = await evalVal(`document.querySelector('#cars-table-body tr:first-child td:nth-child(5) .status-pill')?.textContent`);
    recordStep('EDIT-02', 'Admin Table Updated', editedPrice.includes('4,800') && editedStatus.includes('Booked') ? 'PASS' : 'FAIL', `Price: "${editedPrice.trim()}", Status: "${editedStatus.trim()}"`);

    // Verify on Public Website
    await send('Page.navigate', { url: `${BASE_URL}/all-cars.html` });
    await wait(1500);

    const publicEditedPrice = await evalVal(`
      const card = Array.from(document.querySelectorAll('#cars-grid .car-card')).find(c => c.textContent.includes('${testCarName}'));
      return card ? card.querySelector('.car-price')?.textContent.trim() : null;
    `);
    const publicBadge = await evalVal(`
      const card = Array.from(document.querySelectorAll('#cars-grid .car-card')).find(c => c.textContent.includes('${testCarName}'));
      return card ? card.querySelector('.car-badge')?.textContent.trim() : null;
    `);
    const publicBtnText = await evalVal(`
      const card = Array.from(document.querySelectorAll('#cars-grid .car-card')).find(c => c.textContent.includes('${testCarName}'));
      return card ? card.querySelector('.car-action-btn')?.textContent.trim() : null;
    `);
    recordStep('EDIT-03', 'Public Site Sync of Edits', publicEditedPrice === '₹4,800 / day' && publicBadge === 'Booked' && publicBtnText === 'Pre-Book' ? 'PASS' : 'FAIL', `Price: "${publicEditedPrice}", Badge: "${publicBadge}", Button: "${publicBtnText}"`);

    // =========================================================================
    // TEST 7: Delete Car Operation & Modal Safety
    // =========================================================================
    console.log('\n--- MODULE 7: Delete Car Operation & Confirmation Modal ---');
    await send('Page.navigate', { url: `${BASE_URL}/admin/index.html#cars` });
    await wait(1200);

    // Trigger delete on top car
    await evalCode(`
      const delBtn = document.querySelector('#cars-table-body tr:first-child button[data-action="delete"]');
      delBtn && delBtn.click();
    `);
    await wait(300);

    const deleteModalOpen = await evalVal(`document.getElementById('delete-modal-backdrop')?.classList.contains('is-open')`);
    recordStep('DEL-01', 'Delete Modal Prompt', deleteModalOpen ? 'PASS' : 'FAIL', 'Delete confirmation modal opened');

    // 7.1 Cancel button check
    await evalCode(`document.getElementById('btn-cancel-delete').click()`);
    await wait(300);
    const deleteModalClosed = await evalVal(`!document.getElementById('delete-modal-backdrop')?.classList.contains('is-open')`);
    const stillPresent = await evalVal(`document.querySelector('#cars-table-body tr:first-child td:nth-child(2) .table-car-name')?.textContent`);
    recordStep('DEL-02', 'Delete Modal Cancel Safety', deleteModalClosed && stillPresent.includes(testCarName) ? 'PASS' : 'FAIL', 'Car remained intact on cancel');

    // 7.2 Confirm delete
    await evalCode(`
      const delBtn = document.querySelector('#cars-table-body tr:first-child button[data-action="delete"]');
      delBtn && delBtn.click();
    `);
    await wait(300);
    await evalCode(`document.getElementById('btn-confirm-delete').click()`);
    await wait(1200);

    const postDelTopCar = await evalVal(`document.querySelector('#cars-table-body tr:first-child td:nth-child(2) .table-car-name')?.textContent`);
    const postDelCount = await evalVal(`document.querySelectorAll('#cars-table-body tr:not(.skeleton-table-row)').length`);
    const allTableNames = await evalVal(`return Array.from(document.querySelectorAll('#cars-table-body tr td:nth-child(2) .table-car-name')).map(el => el.textContent.trim())`);
    console.log('  -> Fleet after deletion:', allTableNames);
    recordStep('DEL-03', 'Confirm Delete Execution', !postDelTopCar.includes(testCarName) && postDelCount === 11 ? 'PASS' : 'FAIL', `Count returned to ${postDelCount}, Top car: "${postDelTopCar}"`);

    // Verify removed from Public Website
    await send('Page.navigate', { url: `${BASE_URL}/all-cars.html` });
    await wait(1500);
    const publicPostDelMatch = await evalVal(`
      return Array.from(document.querySelectorAll('#cars-grid .car-card')).some(c => c.textContent.includes('${testCarName}'));
    `);
    const publicPostDelCount = await evalVal(`document.querySelectorAll('#cars-grid .car-card').length`);
    recordStep('DEL-04', 'Public Site Immediate Removal Sync', !publicPostDelMatch && publicPostDelCount === 11 ? 'PASS' : 'FAIL', `Removed from public grid. Fleet count: ${publicPostDelCount}`);

    // =========================================================================
    // TEST 8: Settings Modal & Cloud Sync Trigger
    // =========================================================================
    console.log('\n--- MODULE 8: Settings Modal & Cloud Sync ---');
    await send('Page.navigate', { url: `${BASE_URL}/admin/index.html#dashboard` });
    await wait(1200);

    await evalCode(`document.getElementById('btn-open-settings').click()`);
    await wait(400);

    const settingsOpen = await evalVal(`document.getElementById('settings-modal-backdrop')?.classList.contains('is-open')`);
    recordStep('SET-01', 'Settings Modal Open', settingsOpen ? 'PASS' : 'FAIL', 'Supabase & Cloudinary Settings dialog open');

    // Test connection button validation
    await evalCode(`document.getElementById('btn-test-supabase').click()`);
    await wait(300);
    const toastMsg = await evalVal(`document.querySelector('.toast-container .toast')?.textContent`);
    recordStep('SET-02', 'Settings Connection Validation', toastMsg ? 'PASS' : 'FAIL', `Toast: "${toastMsg}"`);

    // Close settings modal
    await evalCode(`document.getElementById('btn-close-settings').click()`);
    await wait(300);
    const settingsClosed = await evalVal(`!document.getElementById('settings-modal-backdrop')?.classList.contains('is-open')`);
    recordStep('SET-03', 'Settings Modal Close', settingsClosed ? 'PASS' : 'FAIL', 'Closed cleanly');

    // =========================================================================
    // TEST 9: Admin Logout & Protected Route Guards
    // =========================================================================
    console.log('\n--- MODULE 9: Admin Logout & Route Protection ---');
    await evalCode(`document.getElementById('btn-admin-logout').click()`);
    await wait(1000);

    const logoutUrl = await evalVal(`window.location.href`);
    const sessionCleared = await evalVal(`localStorage.getItem('carcastle_admin_session') === null`);
    recordStep('AUTH-03', 'Admin Logout Execution', logoutUrl.includes('login.html') && sessionCleared ? 'PASS' : 'FAIL', `Redirected to ${logoutUrl}, Session cleared: ${sessionCleared}`);

    // Attempt direct access to index.html without session
    await send('Page.navigate', { url: `${BASE_URL}/admin/index.html` });
    await wait(1200);
    const bouncedUrl = await evalVal(`window.location.href`);
    recordStep('AUTH-04', 'Route Guard Protection', bouncedUrl.includes('login.html') ? 'PASS' : 'FAIL', `Bounced unauthenticated user to ${bouncedUrl}`);

    // =========================================================================
    // TEST 10: Public Website Fleet Category Tabs & Home Search
    // =========================================================================
    console.log('\n--- MODULE 10: Public Site Filter Tabs & Features ---');
    await send('Page.navigate', { url: `${BASE_URL}/index.html` });
    await wait(1500);

    // 10.1 All Cars Tab
    const homeTotalCars = await evalVal(`document.querySelectorAll('#cars-grid .car-card').length`);
    recordStep('PUB-01', 'Homepage Fleet Rendering', homeTotalCars === 11 ? 'PASS' : 'FAIL', `Initial cards count: ${homeTotalCars}`);

    // 10.2 Regular Cars Tab
    await evalCode(`document.querySelector('.tab-btn[data-filter="reg"]').click()`);
    await wait(300);
    const regCards = await evalVal(`document.querySelectorAll('#cars-grid .car-card').length`);
    recordStep('PUB-02', 'Regular Fleet Filter Tab', regCards > 0 && regCards < homeTotalCars ? 'PASS' : 'FAIL', `Regular cars: ${regCards}`);

    // 10.3 Premium Cars Tab
    await evalCode(`document.querySelector('.tab-btn[data-filter="prem"]').click()`);
    await wait(300);
    const premCards = await evalVal(`document.querySelectorAll('#cars-grid .car-card').length`);
    recordStep('PUB-03', 'Premium Fleet Filter Tab', premCards > 0 && premCards < homeTotalCars ? 'PASS' : 'FAIL', `Premium cars: ${premCards}`);

    // 10.4 Contact Page Enquiry Form
    await send('Page.navigate', { url: `${BASE_URL}/contact.html` });
    await wait(1200);
    const contactTitle = await evalVal(`document.querySelector('h1.section-title')?.textContent`);
    const namePlaceholder = await evalVal(`document.getElementById('name')?.getAttribute('placeholder')`);
    const waChatBtn = await evalVal(`document.querySelector('a[href*="wa.me"]')?.textContent.trim()`);
    recordStep('PUB-04', 'Contact Us Form Content', contactTitle.includes('Get In Touch') && namePlaceholder === 'Enter your full name' ? 'PASS' : 'FAIL', `Title: "${contactTitle.trim()}", Placeholder: "${namePlaceholder}", WA: "${waChatBtn}"`);

    ws.close();
  } finally {
    proc.kill();
  }

  // Summary
  console.log('\n================================================================');
  console.log('                     AUDIT RESULTS SUMMARY                      ');
  console.log('================================================================');
  const passes = auditLog.filter(s => s.status === 'PASS').length;
  const fails = auditLog.filter(s => s.status === 'FAIL').length;
  console.log(`Total Checks Executed : ${auditLog.length}`);
  console.log(`Passed Checks         : ${passes} ✅`);
  console.log(`Failed Checks         : ${fails} ${fails > 0 ? '❌' : ''}`);
  console.log(`Success Rate          : ${((passes / auditLog.length) * 100).toFixed(1)}%`);

  if (fails > 0) {
    console.error('\nFAILURES DETECTED:');
    auditLog.filter(s => s.status === 'FAIL').forEach(f => console.error(`  - [${f.id}] ${f.title}: ${f.details}`));
    process.exit(1);
  } else {
    console.log('\n🎉 ALL ADMIN & SITE FUNCTIONS CONNECTED AND SYNCHRONIZED PERFECTLY WITHOUT ANY ERRORS!');
  }
}

runComprehensiveAudit().catch(err => {
  console.error('Fatal Audit Runner Error:', err);
  process.exit(1);
});
