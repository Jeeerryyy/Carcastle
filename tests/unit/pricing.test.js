const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

function calculateBookingCost(pricePerDay, startDateStr, endDateStr, pricePerHour = 0, hours = 0) {
  const d1 = new Date(startDateStr);
  const d2 = new Date(endDateStr);
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  
  let cost = diffDays * pricePerDay;
  if (hours > 0 && pricePerHour > 0) {
    cost += hours * pricePerHour;
  }
  return { days: diffDays, total: cost };
}

describe('Pricing Calculation Engine', () => {
  test('calculates 1-day rental standard rate', () => {
    const res = calculateBookingCost(1500, '2026-11-01', '2026-11-02');
    assert.equal(res.days, 1);
    assert.equal(res.total, 1500);
  });

  test('calculates multi-day rental for luxury SUV (Thar)', () => {
    const res = calculateBookingCost(3500, '2026-11-01', '2026-11-05');
    assert.equal(res.days, 4);
    assert.equal(res.total, 14000);
  });

  test('handles same-day booking as minimum 1-day rental', () => {
    const res = calculateBookingCost(2000, '2026-11-01', '2026-11-01');
    assert.equal(res.days, 1);
    assert.equal(res.total, 2000);
  });

  test('calculates extra overtime hours', () => {
    const res = calculateBookingCost(2000, '2026-11-01', '2026-11-02', 150, 3);
    assert.equal(res.days, 1);
    assert.equal(res.total, 2450);
  });
});
