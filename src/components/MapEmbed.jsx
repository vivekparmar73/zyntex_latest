import { useState } from 'react';
import { contact, mapLinks } from '../data/site';
import { useLanguage } from '../i18n/LanguageContext';
import { ArrowUpRight } from './Icons';

/** OpenStreetMap embed with a marker at the Zyntex coordinates (no API key needed). */
export default function MapEmbed({ className = '', height }) {
  const { t } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`map ${loaded ? 'is-loaded' : ''} ${className}`} style={height ? { height } : undefined}>
      <iframe
        title={`Zyntex location map (${contact.lat}, ${contact.lng})`}
        src={mapLinks.embed}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoaded(true)}
      />
      <a className="map__open" href={mapLinks.open} target="_blank" rel="noopener noreferrer">
        {t('contact.openMap')} <ArrowUpRight size={16} />
      </a>
    </div>
  );
}
