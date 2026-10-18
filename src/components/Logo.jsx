// Zyntex wordmark. No logo file was supplied, so this is an SVG/HTML rendition —
// replace the <svg> with the official logo when available.
export default function Logo({ tone = 'dark', className = '' }) {
  return (
    <span className={`logo logo--${tone} ${className}`}>
      <svg className="logo__mark" viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <linearGradient id="zx-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4fb383" />
            <stop offset="1" stopColor="#0f5c3a" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="46" height="46" rx="12" fill="url(#zx-g)" />
        <path className="logo__z" d="M14 14h20L15 34h20" fill="none" stroke="#fff" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="logo__word">ZYNTEX</span>
    </span>
  );
}
