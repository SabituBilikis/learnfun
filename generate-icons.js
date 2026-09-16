import sharp from 'sharp';
import fs from 'fs';

async function generateIcons() {
  const input = 'src/imports/Learn_fun.png';
  if (!fs.existsSync(input)) {
    console.error('Input file not found:', input);
    return;
  }

  // 1. Master PWA & Google Play Store Icon (512x512)
  // Matching the Google Play Store icon design: logo centered on a pure white (#FFFFFF) background
  // 420x420 fit contain fills ~82% of the canvas with clean white margins.
  const logo420 = await sharp(input).resize(420, 420, { fit: 'contain' }).png().toBuffer();
  const master = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: logo420, gravity: 'center' }])
    .flatten({ background: '#FFFFFF' })
    .png()
    .toBuffer();

  fs.mkdirSync('marketing/google-play/icon', { recursive: true });
  await sharp(master).png().toFile('marketing/google-play/icon/learn-fun-icon-512.png');
  await sharp(master).png().toFile('public/icon-512x512.png');
  await sharp(master).resize(192, 192).png().toFile('public/icon-192x192.png');
  await sharp(master).resize(180, 180).png().toFile('public/apple-touch-icon.png');

  if (fs.existsSync('dist')) {
    await sharp(master).png().toFile('dist/icon-512x512.png');
    await sharp(master).resize(192, 192).png().toFile('dist/icon-192x192.png');
    await sharp(master).resize(180, 180).png().toFile('dist/apple-touch-icon.png');
  }

  // 2. Native Android Mipmap Icons (ic_launcher, ic_launcher_round, ic_launcher_foreground)
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

    // Legacy & Round Launcher Icons (Solid White #FFFFFF canvas + centered logo at 80% scale)
    const innerSize = Math.round(size * 0.80);
    const innerLogo = await sharp(input).resize(innerSize, innerSize, { fit: 'contain' }).png().toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite([{ input: innerLogo, gravity: 'center' }])
      .flatten({ background: '#FFFFFF' })
      .png()
      .toFile(`${outputDirectory}/ic_launcher.png`);

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite([{ input: innerLogo, gravity: 'center' }])
      .flatten({ background: '#FFFFFF' })
      .png()
      .toFile(`${outputDirectory}/ic_launcher_round.png`);

    // Adaptive Foreground Icon (Transparent canvas + logo scaled to 64% of 108dp canvas for safe-zone masking)
    const fgInnerSize = Math.round(foregroundSize * 0.64);
    const fgLogo = await sharp(input).resize(fgInnerSize, fgInnerSize, { fit: 'contain' }).png().toBuffer();

    await sharp({
      create: {
        width: foregroundSize,
        height: foregroundSize,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      },
    })
      .composite([{ input: fgLogo, gravity: 'center' }])
      .png()
      .toFile(`${outputDirectory}/ic_launcher_foreground.png`);
  }

  console.log('Icons generated successfully for Web, PWA, and Android Adaptive Launcher.');
}

generateIcons().catch(console.error);

