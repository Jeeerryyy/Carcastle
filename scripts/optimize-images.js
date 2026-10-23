const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.resolve(__dirname, '..', 'carcastlegoa', 'images');

const IMAGES_TO_CONVERT = [
  { src: 'main_car.png', dest: 'main_car.webp', quality: 85, maxWidth: 1200 },
  { src: 'bento_luxury.jpg', dest: 'bento_luxury.webp', quality: 80, maxWidth: 1200 },
  { src: 'bento_speedometer.jpg', dest: 'bento_speedometer.webp', quality: 80, maxWidth: 1200 },
  { src: 'hero_road.jpg', dest: 'hero_road.webp', quality: 80, maxWidth: 1920 },
  { src: 'promo_airport.jpg', dest: 'promo_airport.webp', quality: 80, maxWidth: 1200 },
  { src: 'promo_festive.jpg', dest: 'promo_festive.webp', quality: 80, maxWidth: 1200 },
  { src: 'logo_full.png', dest: 'logo_full.webp', quality: 90, maxWidth: 600 }
];

async function run() {
  console.log('--- Car Castle Goa: Image Optimization & WebP Conversion ---');
  let totalSavedBytes = 0;

  for (const item of IMAGES_TO_CONVERT) {
    const srcPath = path.join(IMAGES_DIR, item.src);
    const destPath = path.join(IMAGES_DIR, item.dest);

    if (!fs.existsSync(srcPath)) {
      console.warn(`[SKIP] Source image not found: ${item.src}`);
      continue;
    }

    const initialSize = fs.statSync(srcPath).size;

    await sharp(srcPath)
      .resize({ width: item.maxWidth, withoutEnlargement: true })
      .webp({ quality: item.quality, effort: 6 })
      .toFile(destPath);

    const newSize = fs.statSync(destPath).size;
    const savings = initialSize - newSize;
    totalSavedBytes += savings;

    console.log(`[CONVERTED] ${item.src} (${(initialSize / 1024).toFixed(1)} KB) -> ${item.dest} (${(newSize / 1024).toFixed(1)} KB) | Saved: ${(savings / 1024).toFixed(1)} KB (-${((savings / initialSize) * 100).toFixed(1)}%)`);
  }

  console.log(`\n🎉 Optimization Complete! Total Bandwidth Saved: ${(totalSavedBytes / (1024 * 1024)).toFixed(2)} MB`);
}

run().catch(err => {
  console.error('Image optimization failed:', err);
  process.exit(1);
});
