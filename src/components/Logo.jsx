import wordmarkGreen from '../assets/images/brand/zyntex-wordmark-green.webp';
import wordmarkWhite from '../assets/images/brand/zyntex-wordmark-white.webp';

// Official Zyntex wordmark (resources/brand). `tone` picks the version for light or dark backgrounds.
export default function Logo({ tone = 'dark', className = '' }) {
  return (
    <img
      className={`logo logo--${tone} ${className}`}
      src={tone === 'light' ? wordmarkWhite : wordmarkGreen}
      alt="Zyntex"
      width="214"
      height="60"
      draggable="false"
    />
  );
}
