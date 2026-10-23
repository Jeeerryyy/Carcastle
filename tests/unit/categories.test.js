const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

function mapCategoryGroup(category, priceVal) {
  const isRegular = category === 'Hatchback' || category === 'Sedan' || priceVal < 2500;
  return isRegular ? 'reg' : 'prem';
}

function getCategoryLabel(category, priceVal) {
  if (category === 'Hatchback') return 'Popular Hatchback';
  if (category === 'Sedan') return 'Executive Sedan';
  if (category === 'SUV' && priceVal >= 3500) return 'Premium SUV';
  if (category === 'MPV') return 'Spacious 7-Seater MPV';
  return `${category} Rental`;
}

describe('Fleet Category Mapping Logic', () => {
  test('maps Hatchback to reg regardless of price', () => {
    assert.equal(mapCategoryGroup('Hatchback', 1500), 'reg');
    assert.equal(mapCategoryGroup('Hatchback', 2600), 'reg');
  });

  test('maps Sedan to reg for standard rates', () => {
    assert.equal(mapCategoryGroup('Sedan', 2200), 'reg');
  });

  test('maps affordable vehicles under 2500 to reg', () => {
    assert.equal(mapCategoryGroup('Compact SUV', 2200), 'reg');
  });

  test('maps Luxury, Convertible, and High-end SUV to prem', () => {
    assert.equal(mapCategoryGroup('SUV', 3500), 'prem');
    assert.equal(mapCategoryGroup('Convertible', 7500), 'prem');
    assert.equal(mapCategoryGroup('Luxury', 6500), 'prem');
  });

  test('generates professional category labels', () => {
    assert.equal(getCategoryLabel('Hatchback', 1500), 'Popular Hatchback');
    assert.equal(getCategoryLabel('Sedan', 2000), 'Executive Sedan');
    assert.equal(getCategoryLabel('SUV', 3500), 'Premium SUV');
    assert.equal(getCategoryLabel('MPV', 3200), 'Spacious 7-Seater MPV');
  });
});
