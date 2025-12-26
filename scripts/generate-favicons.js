const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pngToIcoModule = require('png-to-ico');
const pngToIco = typeof pngToIcoModule === 'function' ? pngToIcoModule : pngToIcoModule.default;

const input = path.join(__dirname, '..', 'public', 'favicon.png');
const out = path.join(__dirname, '..', 'public');

async function gen() {
  if (!fs.existsSync(input)) {
    console.error('Input file does not exist:', input);
    process.exit(1);
  }

  // Load source and trim transparent padding, then ensure square by extracting center
  const base = sharp(input).png();

  // Try to trim transparent padding first
  const trimmedBuffer = await base.trim().toBuffer();

  // Create multi sizes
  const sizes = [16, 32, 48, 180];
  const pngPaths = [];

  await Promise.all(
    sizes.map(async (s) => {
      const p = path.join(out, `favicon-${s}x${s}.png`);
      await sharp(trimmedBuffer)
        .resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(p);
      pngPaths.push(p);
      console.log('Wrote', p);
    })
  );

  // Create apple touch icon (180)
  const applePath = path.join(out, 'apple-touch-icon.png');
  await sharp(trimmedBuffer)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(applePath);
  console.log('Wrote', applePath);

  // Create favicon.ico from 16/32/48
  const icoOut = path.join(out, 'favicon.ico');
  const icoBuf = await pngToIco([path.join(out, 'favicon-16x16.png'), path.join(out, 'favicon-32x32.png'), path.join(out, 'favicon-48x48.png')]);
  fs.writeFileSync(icoOut, icoBuf);
  console.log('Wrote', icoOut);

  // Also write a cleaned primary favicon.png at 192x192
  const mainOut = path.join(out, 'favicon.png');
  await sharp(trimmedBuffer)
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(mainOut);
  console.log('Wrote primary', mainOut);
}

gen().catch((err) => {
  console.error(err);
  process.exit(1);
});