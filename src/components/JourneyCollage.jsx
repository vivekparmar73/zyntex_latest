import { Img, Reveal } from './Motion';
import { images } from '../assets/images';
import halfA from '../assets/images/main-image-1-a.webp';
import halfB from '../assets/images/main-image-1-b.webp';

/**
 * MAIN IMAGE - 1, never cropped. Wide screens show the whole collage in one row; phones show its
 * two halves stacked (split at the collage's own white gutter) so every photo stays readable.
 */
export default function JourneyCollage({ className = '' }) {
  return (
    <Reveal className={`journey__collage ${className}`}>
      <Img image={images.main1} className="journey__collage-wide" sizes="(max-width: 1440px) 100vw, 1440px" />
      <div className="journey__collage-stack">
        <img src={halfA} alt="" loading="lazy" decoding="async" width="1200" height="750" />
        <img src={halfB} alt="" loading="lazy" decoding="async" width="1200" height="754" />
      </div>
    </Reveal>
  );
}
