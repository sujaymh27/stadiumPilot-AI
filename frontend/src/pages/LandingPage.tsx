import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Route, Accessibility, Users, Utensils, Train, Globe,
  ChevronRight, Brain, Map
} from 'lucide-react';

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const stats = [
    { key: 'capacity', value: '82,500' },
    { key: 'levels', value: '3' },
    { key: 'gates', value: '6' },
    { key: 'elevators', value: '4' },
  ];

  const features = [
    { key: 'routing',    Icon: Route },
    { key: 'accessible', Icon: Accessibility },
    { key: 'crowd',      Icon: Users },
    { key: 'amenity',    Icon: Utensils },
    { key: 'transport',  Icon: Train },
    { key: 'multilingual', Icon: Globe },
  ];

  return (
    <main id="main-content">
      {/* Hero */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-content">
          <div className="hero-badge" aria-label="AI-powered">AI-Powered Navigation</div>
          <h1 id="hero-heading" className="hero-title">{t('landing.hero_title')}</h1>
          <p className="hero-sub">{t('landing.hero_sub')}</p>
          <button
            id="cta-dashboard"
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/dashboard')}
            aria-label={t('landing.cta')}
          >
            {t('landing.cta')}
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-map-mock">
            <Map size={48} />
            <div className="hero-map-route" />
            <div className="hero-map-pulse" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section" aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="section-title">{t('landing.overview_title')}</h2>
        <p className="section-sub">{t('landing.overview_desc')}</p>
        <div className="stats-grid">
          {stats.map(stat => (
            <div key={stat.key} className="stat-card">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{t(`landing.overview_stats.${stat.key}`)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="features-section" aria-labelledby="features-heading">
        <h2 id="features-heading" className="section-title">{t('landing.features_title')}</h2>
        <div className="features-grid">
          {features.map(({ key, Icon }) => (
            <article key={key} className="feature-card">
              <div className="feature-icon" aria-hidden="true">
                <Icon size={24} />
              </div>
              <h3 className="feature-title">{t(`landing.features.${key}`)}</h3>
              <p className="feature-desc">{t(`landing.features.${key}_desc`)}</p>
            </article>
          ))}
        </div>
      </section>

      {/* AI Section */}
      <section className="ai-section" aria-labelledby="ai-heading">
        <div className="ai-section-content">
          <div className="ai-section-icon" aria-hidden="true">
            <Brain size={40} />
          </div>
          <h2 id="ai-heading" className="section-title">{t('landing.ai_title')}</h2>
          <p className="section-sub">{t('landing.ai_desc')}</p>
          <div className="ai-tools-grid" aria-label="AI tool capabilities">
            {[
              'find_route', 'find_nearest_amenity',
              'get_crowd_status', 'get_transport_info',
              'get_section_info', 'get_parking_info'
            ].map(tool => (
              <div key={tool} className="ai-tool-chip">
                {tool.replace(/_/g, ' ')}
              </div>
            ))}
          </div>
          <button
            id="cta-try-dashboard"
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/dashboard')}
            aria-label="Open the matchday dashboard"
          >
            Try the Dashboard
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </section>
    </main>
  );
}
