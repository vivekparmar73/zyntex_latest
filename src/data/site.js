// Central company facts. Anything marked TODO must be confirmed by Zyntex before launch.

export const contact = {
  email: 'info@zyntex.in',
  phoneDisplay: '+91 78 630 24047',
  phoneHref: 'tel:+917863024047',
  linkedin: 'https://www.linkedin.com/company/zyntex/home/',
  lat: 21.264903,
  lng: 72.933053,
};

export const mapLinks = {
  open: `https://www.google.com/maps/search/?api=1&query=${contact.lat},${contact.lng}`,
  embed: (() => {
    const d = 0.012;
    const bbox = [contact.lng - d, contact.lat - d * 0.7, contact.lng + d, contact.lat + d * 0.7].join('%2C');
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${contact.lat}%2C${contact.lng}`;
  })(),
};

export const legalEntity = 'Indoprimo Apparel Private Limited';

// TODO: the brief gives 150+ (homepage) and 200+ (About Us). Reconcile before launch.
export const workforce = { home: '150', about: '200' };

// TODO: confirm what "10+" counts (customer markets?) and what "1M+ annually" measures.
export const stats = [
  { value: 10, suffix: '+', labelKey: 'stats.countries' },
  { value: 1, suffix: 'M+', labelKey: 'stats.annually' },
];

// Supplied photographs (resources/*.jpg). Roles were not supplied — TODO: add verified titles.
export const team = [
  { name: 'Raaj', slug: 'raaj', role: null },
  { name: 'Anchit', slug: 'anchit', role: null },
  { name: 'Arvind', slug: 'arvind', role: null },
  { name: 'Dhirubhai', slug: 'dhirubhai', role: null },
  { name: 'Fareen', slug: 'fareen', role: null },
  { name: 'Harsh', slug: 'harsh', role: null },
  { name: 'Meet', slug: 'meet', role: null },
  { name: 'Nandita', slug: 'nandita', role: null },
];

// Product shots cut from MAIN IMAGE - 1, in file order (product-01 … product-16).
// Category values follow the categories shown in PRODCTS - 1.
export const productItems = [
  { label: 'Pinstripe resort shirt', category: 'wovens' },
  { label: 'Washed denim skort', category: 'denim' },
  { label: 'Striped henley & slim jeans', category: 'knits' },
  { label: 'Relaxed lounge shorts', category: 'lounge' },
  { label: 'Ribbed knit tank', category: 'knits' },
  { label: 'Denim dungarees', category: 'denim' },
  { label: 'Cotton co-ord set', category: 'wovens' },
  { label: 'Knit sweat shorts', category: 'active' },
  { label: 'Structured cap-sleeve shirt', category: 'wovens' },
  { label: 'Pleated chino trousers', category: 'wovens' },
  { label: 'Chambray shirt dress', category: 'wovens' },
  { label: 'Ruffle-sleeve jersey top', category: 'knits' },
  { label: "Girls' printed tiered dress", category: 'kids' },
  { label: 'Quilted puffer jacket', category: 'outerwear' },
  { label: 'Linen-blend pullover hoodie', category: 'active' },
  { label: 'Fleece sweat set', category: 'lounge' },
];

export const productCategories = [
  { id: 'knits', name: 'Knits' },
  { id: 'wovens', name: 'Wovens' },
  { id: 'denim', name: 'Denim' },
  { id: 'outerwear', name: 'Outerwear' },
  { id: 'active', name: 'Activewear & Athleisure' },
  { id: 'lounge', name: 'Sleepwear & Lounge' },
  { id: 'kids', name: 'Childrenwear' },
  { id: 'workwear', name: 'Workwear' },
  { id: 'undergarments', name: 'Undergarments' },
  { id: 'accessories', name: 'Accessories' },
];

export const routes = {
  divisions: '/',
  apparel: '/apparel/',
  journey: '/apparel/#our-journey',
  design: '/apparel-designer/',
  products: '/products/',
  manufacturing: '/clothing-and-apparel-manufacturers/',
  opex: '/operational-excellence/',
  about: '/about-us/',
  leadership: '/leadership/',
  contact: '/contact-us/',
  it: '/integrated-systems/',
};
