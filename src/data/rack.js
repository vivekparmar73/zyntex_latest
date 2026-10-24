// Garments on the homepage clothing rack. Photos come from resources/racks, prepared by
// scripts/prepare-rack.py (black hangers) and `npm run images` — run both with `npm run rack`.
// A garment whose photo is missing is skipped automatically.
import meta from '../assets/images/racks/meta.json';

const files = import.meta.glob('../assets/images/racks/*.webp', { eager: true, import: 'default' });

const list = [
  { file: 'rack1', name: 'Strappy Crop Top', category: 'Womenswear' },
  { file: 'rack2', name: 'Floral Chiffon Dress', category: 'Womenswear' },
  { file: 'rack3', name: 'Hooded Puffer Coat', category: 'Outerwear' },
  { file: 'rack4', name: 'Terry Bathrobe', category: 'Nightwear' },
  { file: 'rack5', name: 'Graphic Sweatshirt', category: 'Knits' },
  { file: 'rack6', name: 'Garment-Dyed Denim Jacket', category: 'Denim' },
  { file: 'rack7', name: 'Oxford Shirt', category: 'Wovens' },
];

export const rackGarments = list
  .filter((g) => meta[g.file] && files[`../assets/images/racks/${g.file}.webp`])
  .map((g) => ({ ...g, src: files[`../assets/images/racks/${g.file}.webp`], ...meta[g.file] }));
