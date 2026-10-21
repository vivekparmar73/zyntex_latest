// Central company facts. Anything marked TODO must be confirmed by Zyntex before launch.

export const contact = {
  email: 'info@zyntex.in',
  phoneDisplay: '+91 78 630 24047',
  phoneHref: 'tel:+917863024047',
  linkedin: 'https://www.linkedin.com/company/zyntex/home/',
  // Originally supplied coordinates — Kholvad / Kamrej area, matching the corporate office address
  lat: 21.264903,
  lng: 72.933053,
  location: 'Kholvad, Kamrej, Surat, Gujarat, India',
  address: 'Plot No. 17, Sidhivinayak Ind. Estate, Kholvad, Surat, Kamrej, Gujarat, India – 394190',
  phoneOffice: '+91 78630 24047',
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

export const workforce = '200';

export const stats = [
  {
    value: 1,
    suffix: 'M+',
    labelKey: 'stats.units',
    text: 'With consistent annual production, we create fashion for some of the biggest names in the industry.',
  },
  {
    value: 10,
    suffix: '+',
    labelKey: 'stats.countries',
    text: 'We continue to expand our international presence, delivering quality apparel to markets around the world.',
  },
];

// Photos are the supplied resources/<FirstName>.jpg files. `tbc` marks roles still to be confirmed.
export const team = [
  { name: 'Raaj Bhalala', slug: 'raaj', role: 'Founder & Director' },
  { name: 'Harsh Bhalala', slug: 'harsh', role: 'Founder & Director' },
  { name: 'Meet Paghadal', slug: 'meet', role: 'CEO, Sportswear' },
  { name: 'Arvind Aiyar', slug: 'arvind', role: 'CEO, Causewear', tbc: true },
  { name: 'Anchit Shukla', slug: 'anchit', role: 'CFO' },
  { name: 'Farheen Kapadia', slug: 'fareen', role: 'COO', tbc: true },
  { name: 'Nandita Patel', slug: 'nandita', role: 'Head of Design' },
  { name: 'Dhirubhai Shekh', slug: 'dhirubhai', role: 'Partner', tbc: true },
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
  home: '/',
  journey: '/our-journey/',
  design: '/apparel-designer/',
  products: '/products/',
  manufacturing: '/clothing-and-apparel-manufacturers/',
  opex: '/operational-excellence/',
  about: '/about-us/',
  leadership: '/leadership/',
  contact: '/contact-us/',
  sitemap: '/sitemap/',
  privacy: '/privacy-policy/',
};
