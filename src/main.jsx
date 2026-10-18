import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import '@fontsource-variable/montserrat';
import '@fontsource-variable/inter';
import './styles/global.css';
import './styles/layout.css';
import './styles/sections.css';
import './styles/pages.css';
import './styles/divisions.css';
import './styles/it.css';
import './styles/effects.css';
import App from './App';
import { LanguageProvider } from './i18n/LanguageContext';
import { SmoothScrollProvider } from './components/SmoothScroll';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <SmoothScrollProvider>
          <MotionConfig reducedMotion="user">
            <App />
          </MotionConfig>
        </SmoothScrollProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
);
