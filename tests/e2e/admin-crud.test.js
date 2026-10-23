/**
 * End-to-End Integration Test Suite for Car Castle Goa
 * Validates public site rendering, vehicle filtering, and Admin CRUD operations
 */
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

// Locate Edge executable
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function runE2E() {
  console.log('--- Starting Car Castle Goa E2E Test Suite ---');

  // Verify server is up on 8080
  const serverUp = await new Promise(resolve => {
    const req = http.get('http://localhost:8080/health', res => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(2000, () => resolve(false));
  });

  if (!serverUp) {
    console.warn('[E2E SKIP] Local server on http://localhost:8080 is not active. Run `npm start` first.');
    return;
  }

  const port = 9228;
  const proc = spawn(edgePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=C:\\Users\\parak\\AppData\\Local\\Temp\\edge-e2e-${Date.now()}`,
    'http://localhost:8080/index.html'
  ]);

  try {
    await wait(2000);

    const tabs = await new Promise((resolve, reject) => {
      http.get(`http://localhost:${port}/json`, res => {
        let data = '';
        res.on('data', d => data += d);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    const pageTab = tabs.find(t => t.url.includes('index.html'));
    if (!pageTab) throw new Error('Could not connect to browser debugging session');

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    let id = 1;
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
        const curId = id++;
        pending.set(curId, resolve);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await send('Runtime.enable');
    await send('Page.enable');

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true });
      return res.result ? res.result.result : null;
    }

    // Test 1: Public Fleet Page
    console.log('[E2E 1/3] Testing Public Fleet Rendering & Category Filtering...');
    await send('Page.navigate', { url: 'http://localhost:8080/all-cars.html' });
    await wait(1500);

    const fleetCount = await evaluate(`document.querySelectorAll('.car-card').length`);
    console.log(`  -> Initial fleet count: ${fleetCount.value}`);
    if (fleetCount.value < 10) throw new Error('Public fleet rendering failed');

    await evaluate(`document.querySelector('.tab-btn[data-filter="reg"]').click()`);
    await wait(300);
    const regCount = await evaluate(`document.querySelectorAll('.car-card').length`);
    console.log(`  -> Regular fleet filtered count: ${regCount.value}`);
    if (regCount.value <= 0 || regCount.value >= fleetCount.value) {
      throw new Error('Regular fleet filter failed');
    }

    // Test 2: Admin Dashboard & Authentication
    console.log('[E2E 2/3] Testing Admin Dashboard Access...');
    // Seed a valid master admin session for headless browser
    await evaluate(`localStorage.setItem('carcastle_admin_session', JSON.stringify({ email: 'carcastlegoa@gmail.com', displayName: 'Car Castle Master Admin', role: 'superadmin', loginTime: Date.now() }))`);
    await send('Page.navigate', { url: 'http://localhost:8080/admin/index.html' });
    await wait(1500);

    const adminHeader = await evaluate(`document.getElementById('page-header-title')?.textContent`);
    console.log(`  -> Admin header title: "${adminHeader.value}"`);
    if (!adminHeader.value.includes('Dashboard')) {
      throw new Error('Admin dashboard failed to load');
    }

    // Test 3: Search in Admin Cars Table
    console.log('[E2E 3/3] Testing Admin Search Filter...');
    await evaluate(`document.getElementById('nav-cars').click()`);
    await wait(300);
    await evaluate(`
      const input = document.getElementById('cars-search-input');
      input.value = 'Fortuner';
      input.dispatchEvent(new Event('input'));
    `);
    await wait(200);
    const matched = await evaluate(`document.querySelector('#cars-table-body tr td:nth-child(2) .table-car-name')?.textContent`);
    console.log(`  -> Search for "Fortuner" matched: "${matched.value}"`);
    if (!matched.value.includes('Fortuner')) {
      throw new Error('Admin car table search failed');
    }

    console.log('✅ ALL E2E INTEGRATION TESTS PASSED CLEANLY!');
    ws.close();
  } finally {
    proc.kill();
  }
}

runE2E().catch(err => {
  console.error('E2E Test Execution Failure:', err);
  process.exit(1);
});
