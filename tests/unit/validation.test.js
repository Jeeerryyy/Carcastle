const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

function validateDateRange(startDate, endDate, todayStr) {
  if (startDate && startDate < todayStr) {
    return { valid: false, error: 'Pick-up date cannot be in the past' };
  }
  if (startDate && endDate && endDate < startDate) {
    return { valid: false, error: 'Drop-off date cannot be earlier than pick-up date' };
  }
  return { valid: true };
}

function validateCarRecord(car) {
  const errors = [];
  if (!car.name || typeof car.name !== 'string' || car.name.trim().length === 0) {
    errors.push('Name is required');
  }
  if (!car.category || typeof car.category !== 'string') {
    errors.push('Category is required');
  }
  if (!car.pricePerDay || typeof car.pricePerDay !== 'number' || car.pricePerDay <= 0) {
    errors.push('Valid pricePerDay is required');
  }
  if (!car.slug || typeof car.slug !== 'string') {
    errors.push('Slug is required');
  }
  return { valid: errors.length === 0, errors };
}

describe('Form & Data Validation Engine', () => {
  test('rejects past dates', () => {
    const res = validateDateRange('2026-01-01', '2026-01-05', '2026-10-23');
    assert.equal(res.valid, false);
    assert.match(res.error, /past/);
  });

  test('rejects drop-off earlier than pick-up', () => {
    const res = validateDateRange('2026-11-10', '2026-11-05', '2026-10-23');
    assert.equal(res.valid, false);
    assert.match(res.error, /earlier/);
  });

  test('accepts valid future date range', () => {
    const res = validateDateRange('2026-11-01', '2026-11-05', '2026-10-23');
    assert.equal(res.valid, true);
  });

  test('validates car record schema correctly', () => {
    const validCar = {
      name: 'Maruti Suzuki Swift',
      category: 'Hatchback',
      pricePerDay: 1500,
      slug: 'maruti-swift-rental-goa'
    };
    assert.equal(validateCarRecord(validCar).valid, true);

    const invalidCar = {
      name: '',
      category: 'Hatchback',
      pricePerDay: -100,
      slug: ''
    };
    const invalidRes = validateCarRecord(invalidCar);
    assert.equal(invalidRes.valid, false);
    assert.equal(invalidRes.errors.length, 3);
  });
});
