// Garments on the homepage clothing rack. Photos come from resources/racks (hangers recoloured
// to black by scripts/blacken-hangers.py, then processed by `npm run images`). A garment whose
// photo is missing is skipped automatically — rack10 (Knit Cardigan) is currently a duplicate of rack9.
import meta from '../assets/images/racks/meta.json';

const files = import.meta.glob('../assets/images/racks/*.webp', { eager: true, import: 'default' });

const list = [
  { file: 'rack1', name: 'Oxford Shirt', category: 'Wovens' },
  { file: 'rack2', name: 'Pullover Hoodie', category: 'Knits' },
  { file: 'rack3', name: 'Denim Jacket', category: 'Denim' },
  { file: 'rack4', name: 'Rosewood Crewneck', category: 'Knitwear' },
  { file: 'rack5', name: 'Satin Lounge Robe', category: 'Nightwear' },
  { file: 'rack6', name: 'Ruffle Bow Blouse', category: 'Womenswear' },
  { file: 'rack7', name: 'Quilted Puffer', category: 'Outerwear' },
  { file: 'rack8', name: 'Printed Midi Dress', category: 'Womenswear' },
  { file: 'rack9', name: 'Cotton Tee', category: 'Knits' },
  { file: 'rack10', name: 'Knit Cardigan', category: 'Knitwear' },
];

export const rackGarments = list
  .filter((g) => meta[g.file] && files[`../assets/images/racks/${g.file}.webp`])
  .map((g) => ({ ...g, src: files[`../assets/images/racks/${g.file}.webp`], ...meta[g.file] }));

// Fewer, larger garments on smaller screens
export const NARROW_SET = ['rack1', 'rack2', 'rack5', 'rack6', 'rack7'];
export const MEDIUM_SET = ['rack1', 'rack2', 'rack3', 'rack4', 'rack5', 'rack6', 'rack7', 'rack8'];
