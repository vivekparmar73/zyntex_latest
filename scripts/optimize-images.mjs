// Converts the original assets in /resources into web-optimised WebP files
// under /src/assets/images. Run with: npm run images
// The originals in /resources are never modified.
import sharp from 'sharp';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const SRC = path.resolve('resources');
const OUT = path.resolve('src/assets/images');

// supplied filename -> web name
const wide = {
  'hOME IMAG.png': 'home-image',
  'MAIN IMAGE - 1.jpg': 'main-image-1',
  'MAKING IMAGE - 11.jpg': 'making-image-11',
  'MAKING IMAGE - 111.png': 'making-image-111',
  'MAKING IMAGE - 1111.jpg': 'making-image-1111',
  'making - 1.png': 'making-1',
  'PRODCTS - 1.jpg': 'products-1',
  'PURE -1.jpg': 'pure-1',
  'design-1.jpg': 'design-1',
  'design-2.jpg': 'design-2',
  'design-3.jpg': 'design-3',
  'design-4.jpg': 'design-4',
  'mission.jpg': 'mission',
  'our -1.png': 'our-1',
};

const team = ['Anchit', 'Arvind', 'Dhirubhai', 'Fareen', 'Harsh', 'Meet', 'Nandita', 'Raaj'];

// Individual product shots cut from MAIN IMAGE - 1 (left, top, right, bottom)
const tiles = [
  [0, 0, 523, 668], [0, 675, 523, 1349],
  [536, 0, 1069, 668], [536, 676, 1069, 1008], [536, 1015, 1069, 1347],
  [1081, 0, 1614, 334],
  [1628, 0, 2159, 668], [1628, 674, 2159, 1349],
  [2173, 0, 2705, 335], [2173, 1012, 2705, 1349],
  [2718, 0, 3250, 668], [2718, 676, 3250, 1349],
  [3264, 0, 3796, 668], [3264, 676, 3796, 1349],
  [3809, 0, 4319, 334], [3809, 340, 4319, 1349],
];

const webp = { quality: 80, effort: 5 };

async function run() {
  await mkdir(path.join(OUT, 'team'), { recursive: true });
  await mkdir(path.join(OUT, 'products'), { recursive: true });
  await mkdir(path.join(OUT, 'brand'), { recursive: true });

  // Logos keep their transparency (lossless WebP)
  for (const name of ['zyntex-wordmark-green', 'zyntex-wordmark-white', 'zyntex-monogram-green', 'zyntex-monogram-white']) {
    await sharp(path.join(SRC, 'brand', `${name}.png`))
      .resize({ width: 640, withoutEnlargement: true })
      .webp({ lossless: true, effort: 6 })
      .toFile(path.join(OUT, 'brand', `${name}.webp`));
    console.log('✓', name);
  }

  for (const [file, name] of Object.entries(wide)) {
    const input = path.join(SRC, file);
    await sharp(input).resize({ width: 2200, withoutEnlargement: true }).webp(webp).toFile(path.join(OUT, `${name}.webp`));
    await sharp(input).resize({ width: 900, withoutEnlargement: true }).webp(webp).toFile(path.join(OUT, `${name}-sm.webp`));
    console.log('✓', file, '->', name);
  }

  for (const person of team) {
    await sharp(path.join(SRC, `${person}.jpg`))
      .resize({ width: 720, height: 900, fit: 'cover', position: 'top' })
      .webp(webp)
      .toFile(path.join(OUT, 'team', `${person.toLowerCase()}.webp`));
    console.log('✓', person);
  }

  const inset = 8;
  for (const [i, [l, t, r, b]] of tiles.entries()) {
    await sharp(path.join(SRC, 'MAIN IMAGE - 1.jpg'))
      .extract({ left: l + inset, top: t + inset, width: r - l - inset * 2, height: b - t - inset * 2 })
      .resize({ width: 640, withoutEnlargement: true })
      .webp(webp)
      .toFile(path.join(OUT, 'products', `product-${String(i + 1).padStart(2, '0')}.webp`));
  }
  console.log('✓', tiles.length, 'product tiles');

  await rackGarments();
}

// Rack garments: resources/racks/black/rackN.png (hangers already recoloured by
// scripts/blacken-hangers.py). Each is trimmed, its hook tip located (the swing pivot),
// and written with its measurements to src/assets/images/racks/meta.json.
async function rackGarments() {
  const src = path.join(SRC, 'racks', 'black');
  const out = path.join(OUT, 'racks');
  await mkdir(out, { recursive: true });
  const files = (await readdir(src)).filter((f) => /^rack\d+\.png$/.test(f)).sort((a, b) => parseInt(a.slice(4)) - parseInt(b.slice(4)));
  const meta = {};
  const seen = new Map();
  for (const file of files) {
    const name = file.replace('.png', '');
    const hash = createHash('md5').update(await readFile(path.join(src, file))).digest('hex');
    if (seen.has(hash)) {
      console.warn(`! ${file} is identical to ${seen.get(hash)} — skipped (replace it with the intended garment)`);
      continue;
    }
    seen.set(hash, file);

    const trimmed = await sharp(path.join(src, file)).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
    const { data, info } = await sharp(trimmed.data).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    // hook tip: centre of the opaque pixels in the first opaque row
    let hookX = info.width / 2;
    let hookY = 0;
    for (let y = 0; y < info.height; y++) {
      const xs = [];
      for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] > 100) xs.push(x);
      if (xs.length) {
        hookX = xs.reduce((a, b) => a + b, 0) / xs.length;
        hookY = y;
        break;
      }
    }
    await sharp(trimmed.data).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(path.join(out, `${name}.webp`));
    meta[name] = { w: info.width, h: info.height, hookX: Math.round(hookX * 10) / 10, hookY };
    console.log('✓', file, `${info.width}×${info.height}`, 'hook', meta[name].hookX, hookY);
  }
  await writeFile(path.join(out, 'meta.json'), JSON.stringify(meta, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
