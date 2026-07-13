import sharp from 'sharp';
import fs from 'fs';

async function generateIcons() {
  const input = 'src/imports/Learn_fun.png';
  if (!fs.existsSync(input)) {
    console.error('Input file not found:', input);
    return;
  }

  // Create an SVG with a rounded rect and a drop shadow, then place the logo on top
  const shadowSvg = (size, padding, radius) => `
    <svg width="${size}" height="${size}">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-opacity="0.15"/>
        </filter>
      </defs>
      <rect x="${padding}" y="${padding}" width="${size - padding*2}" height="${size - padding*2}" rx="${radius}" ry="${radius}" fill="white" filter="url(#shadow)" />
    </svg>
  `;

  // 512x512 icon
  const padding512 = 32;
  const size512 = 512;
  const radius512 = (size512 - padding512 * 2) * 0.22; // ~22% of inner size

  await sharp(Buffer.from(shadowSvg(size512, padding512, radius512)))
    .composite([
      { 
        input: await sharp(input).resize(360, 360, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).toBuffer(), 
        gravity: 'center' 
      }
    ])
    .png()
    .toFile('public/icon-512x512.png');

  // 192x192 icon
  const padding192 = 12;
  const size192 = 192;
  const radius192 = (size192 - padding192 * 2) * 0.22;

  await sharp(Buffer.from(shadowSvg(size192, padding192, radius192)))
    .composite([
      { 
        input: await sharp(input).resize(140, 140, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).toBuffer(), 
        gravity: 'center' 
      }
    ])
    .png()
    .toFile('public/icon-192x192.png');

  console.log('Icons generated successfully.');
}

generateIcons().catch(console.error);
