import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Globe, LayoutDashboard, Home } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'hi', label: 'हिंदी' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="navbar" role="banner">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" aria-label="StadiumPilot AI home">
          <MapPin size={22} aria-hidden="true" />
          <span>{t('nav.brand')}</span>
        </Link>

        <nav className="navbar-links" aria-label="Main navigation">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'nav-link--active' : ''}`}
            aria-current={location.pathname === '/' ? 'page' : undefined}
          >
            <Home size={16} aria-hidden="true" />
            <span>{t('nav.landing')}</span>
          </Link>
          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === '/dashboard' ? 'nav-link--active' : ''}`}
            aria-current={location.pathname === '/dashboard' ? 'page' : undefined}
          >
            <LayoutDashboard size={16} aria-hidden="true" />
            <span>{t('nav.dashboard')}</span>
          </Link>
        </nav>

        <div className="lang-selector" ref={langRef}>
          <button
            className="lang-btn"
            onClick={() => setLangOpen(v => !v)}
            aria-label={t('nav.language')}
            aria-expanded={langOpen}
            aria-haspopup="listbox"
          >
            <Globe size={16} aria-hidden="true" />
            <span>{LANGUAGES.find(l => l.code === i18n.language)?.label ?? 'English'}</span>
          </button>
          {langOpen && (
            <ul className="lang-dropdown" role="listbox" aria-label="Select language">
              {LANGUAGES.map(lang => (
                <li key={lang.code} role="option" aria-selected={i18n.language === lang.code}>
                  <button
                    onClick={() => { i18n.changeLanguage(lang.code); setLangOpen(false); }}
                    className={i18n.language === lang.code ? 'active' : ''}
                  >
                    {lang.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
