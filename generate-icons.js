import sharp from 'sharp';
import fs from 'fs';

async function generateIcons() {
  const input = 'src/imports/Learn_fun.png';
  if (!fs.existsSync(input)) {
    console.error('Input file not found:', input);
    return;
  }

  const logo = await sharp(input).resize(500, 500, { fit: 'contain' }).png().toBuffer();
  const master = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: logo, gravity: 'center' }])
    .flatten({ background: '#FFFFFF' })
    .png()
    .toBuffer();
  fs.mkdirSync('marketing/google-play/icon', { recursive: true });
  await sharp(master).png().toFile('marketing/google-play/icon/learn-fun-icon-512.png');
  await sharp(master).png().toFile('public/icon-512x512.png');
  await sharp(master).resize(192, 192).png().toFile('public/icon-192x192.png');

  const androidIconSizes = [
    { directory: 'mipmap-mdpi', size: 48, foregroundSize: 108 },
    { directory: 'mipmap-hdpi', size: 72, foregroundSize: 162 },
    { directory: 'mipmap-xhdpi', size: 96, foregroundSize: 216 },
    { directory: 'mipmap-xxhdpi', size: 144, foregroundSize: 324 },
    { directory: 'mipmap-xxxhdpi', size: 192, foregroundSize: 432 },
  ];

  for (const { directory, size, foregroundSize } of androidIconSizes) {
    const outputDirectory = `android/app/src/main/res/${directory}`;
    fs.mkdirSync(outputDirectory, { recursive: true });

    await sharp(input)
      .resize(size, size, { fit: 'contain', background: '#FFFFFF' })
      .png()
      .toFile(`${outputDirectory}/ic_launcher.png`);
    await sharp(input)
      .resize(size, size, { fit: 'contain', background: '#FFFFFF' })
      .png()
      .toFile(`${outputDirectory}/ic_launcher_round.png`);
    await sharp(input)
      .resize(foregroundSize, foregroundSize, { fit: 'contain', background: '#FFFFFF' })
      .png()
      .toFile(`${outputDirectory}/ic_launcher_foreground.png`);
  }

  console.log('Web and Android icons generated successfully.');
}

generateIcons().catch(console.error);
