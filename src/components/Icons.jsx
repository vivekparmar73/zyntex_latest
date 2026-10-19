const base = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' };

export const ArrowRight = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="1.8" aria-hidden="true">
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const ArrowUpRight = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="1.8" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const Chevron = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="2" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const GlobeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="1.6" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9S14.5 18.3 12 21c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" />
  </svg>
);

export const MailIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="1.6" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const PhoneIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="1.6" aria-hidden="true">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);

export const PinIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} strokeWidth="1.6" aria-hidden="true">
    <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

export const LinkedInIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm7 0h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.1c0-1.22-.02-2.79-1.7-2.79-1.7 0-1.96 1.33-1.96 2.7V21h-4V9.5Z" />
  </svg>
);

export const MenuIcon = ({ open }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" {...base} strokeWidth="1.8" aria-hidden="true">
    {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M10 17h10" />}
  </svg>
);

/* Feature icons for Key Strengths (Design / Manufacturing / Products) */
export const DesignIcon = () => (
  <svg viewBox="0 0 64 64" {...base} strokeWidth="1.6" aria-hidden="true">
    <path d="M22 10 32 16l10-6 12 8-5 10-5-2v28H20V26l-5 2-5-10 12-8Z" />
    <path d="M27 12c1.5 3 3 4.4 5 4.4s3.5-1.4 5-4.4" />
    <path d="M44 40 54 30l3 3-10 10-4 1 1-4Z" />
  </svg>
);

export const ManufacturingIcon = () => (
  <svg viewBox="0 0 64 64" {...base} strokeWidth="1.6" aria-hidden="true">
    <path d="M8 54V30l12-7v7l12-7v7l12-7v31Z" />
    <path d="M44 54V12h8v42" />
    <path d="M4 54h56" />
    <path d="M15 40h6M27 40h6M15 47h6M27 47h6" />
  </svg>
);

export const ProductsIcon = () => (
  <svg viewBox="0 0 64 64" {...base} strokeWidth="1.6" aria-hidden="true">
    <path d="M32 10a4 4 0 1 1 4 4c-2 0-4 1.5-4 4" />
    <path d="M32 18 8 34c-2 1.3-1 4 1.3 4h45.4c2.3 0 3.3-2.7 1.3-4Z" />
    <path d="M18 38v12h28V38" />
  </svg>
);

export const OpexIcon = () => (
  <svg viewBox="0 0 64 64" {...base} strokeWidth="1.6" aria-hidden="true">
    <path d="M32 8v6M32 50v6M8 32h6M50 32h6M15 15l4.2 4.2M44.8 44.8 49 49M15 49l4.2-4.2M44.8 19.2 49 15" />
    <circle cx="32" cy="32" r="16" />
    <path d="m24.5 32.5 5 5 10-11" />
  </svg>
);

/* Operational Excellence: globe-style circular line icons, all on the same 80×80 grid */
const OpexFrame = ({ children }) => (
  <svg viewBox="0 0 80 80" {...base} strokeWidth="1.4" aria-hidden="true">
    <circle cx="40" cy="40" r="37" opacity="0.35" />
    <ellipse cx="40" cy="40" rx="37" ry="13" opacity="0.18" />
    <ellipse cx="40" cy="40" rx="13" ry="37" opacity="0.18" />
    <g strokeWidth="1.8">{children}</g>
  </svg>
);

export const opexIcons = [
  // Factual insights — magnifier over a bar chart
  () => (
    <OpexFrame>
      <path d="M26 50V42M32 50V36M38 50V40" />
      <circle cx="45" cy="35" r="9" />
      <path d="m51.5 41.5 7 7" />
    </OpexFrame>
  ),
  // Customized solutions — needle & thread through a gear
  () => (
    <OpexFrame>
      <circle cx="40" cy="40" r="7" />
      <path d="M40 25v5M40 50v5M25 40h5M50 40h5M29.4 29.4l3.5 3.5M47.1 47.1l3.5 3.5M29.4 50.6l3.5-3.5M47.1 32.9l3.5-3.5" />
    </OpexFrame>
  ),
  // Reliable infrastructure — factory
  () => (
    <OpexFrame>
      <path d="M24 54V40l9-5v5l9-5v5l9-5v19Z" />
      <path d="M51 54V28h5v26" />
      <path d="M22 54h36" />
    </OpexFrame>
  ),
  // Skilled team — three people
  () => (
    <OpexFrame>
      <circle cx="40" cy="32" r="5" />
      <path d="M31 51c0-5.5 4-9 9-9s9 3.5 9 9" />
      <circle cx="27" cy="36" r="3.5" />
      <circle cx="53" cy="36" r="3.5" />
      <path d="M20 50c0-4 2.8-6.5 6.5-6.5M60 50c0-4-2.8-6.5-6.5-6.5" />
    </OpexFrame>
  ),
  // Performance management — gauge
  () => (
    <OpexFrame>
      <path d="M24 48a16 16 0 1 1 32 0" />
      <path d="m40 48 9-11" />
      <circle cx="40" cy="48" r="2" />
      <path d="M28 40l2 1M40 32v2.5M52 40l-2 1" />
    </OpexFrame>
  ),
  // Timely deliveries — truck with clock
  () => (
    <OpexFrame>
      <path d="M20 48V34h22v14M42 39h9l5 5v4h-4" />
      <path d="M26 48h12" />
      <circle cx="29" cy="49" r="3" />
      <circle cx="49" cy="49" r="3" />
      <path d="M31 28a5 5 0 1 0 0 .01M31 25.5V28h2" opacity="0.9" />
    </OpexFrame>
  ),
];
