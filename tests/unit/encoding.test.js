const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

function buildWhatsAppMessage({ vehicleName, location, startDate, endDate, price }) {
  const lines = [
    'Hi Car Castle Goa! I would like to book:',
    `🚗 Vehicle: ${vehicleName || 'N/A'}`,
    `📍 Pick-up Location: ${location || 'Goa Airport / Doorstep'}`,
    `🗓️ Pick-up Date & Time: ${startDate || 'Flexible'}`,
    `🏁 Drop-off Date & Time: ${endDate || 'Flexible'}`,
    `💰 Daily Rate: ₹${price || '0'}/day`,
    '',
    'Please confirm availability and share booking details!'
  ];
  return lines.join('\n');
}

function generateWhatsAppUrl(phone, payload) {
  const text = buildWhatsAppMessage(payload);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

describe('WhatsApp Message Formatting & URL Encoding', () => {
  test('generates valid URL without unescaped spaces or malformed tokens', () => {
    const url = generateWhatsAppUrl('918767286682', {
      vehicleName: 'Mahindra Thar 4x4',
      location: 'Mopa Airport (GOX)',
      startDate: 'Nov 1, 2026 at 10:00 AM',
      endDate: 'Nov 5, 2026 at 10:00 AM',
      price: '3,500'
    });

    assert.ok(url.startsWith('https://wa.me/918767286682?text='));
    assert.ok(!url.includes(' ')); // All spaces must be encoded (%20 or +)
    assert.ok(!url.includes('\n')); // All newlines must be encoded (%0A)
    assert.ok(url.includes('%E2%9C%A8') || url.includes('%F0%9F%9A%97')); // Emoji properly encoded
  });

  test('handles special characters and quotes gracefully', () => {
    const url = generateWhatsAppUrl('918767286682', {
      vehicleName: "Swift 'ZXi' & Baleno",
      location: 'Candolim & Calangute Beach',
      price: '1,500'
    });

    const parsed = new URL(url);
    const decodedText = parsed.searchParams.get('text');
    assert.match(decodedText, /Swift 'ZXi' & Baleno/);
    assert.match(decodedText, /Candolim & Calangute Beach/);
  });
});
