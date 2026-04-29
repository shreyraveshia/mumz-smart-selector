import React from 'react';

export default function Header({ t, lang, onToggleLang, theme, onToggleTheme }) {
  const themeLabel = t.switchTheme?.[theme] || (theme === 'dark' ? '☀️ Light' : '🌙 Dark');

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <span className="header-logo">✨</span>
          <div>
            <h1 className="header-title">{t.appName}</h1>
            <p className="header-tagline">{t.tagline}</p>
          </div>
        </div>
        <div className="header-controls">
          <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
            {themeLabel}
          </button>
          <button className="lang-toggle" onClick={onToggleLang} aria-label="Toggle language">
            <span className="lang-icon">🌐</span>
            {t.switchLang}
          </button>
        </div>
      </div>
      <div className="header-badge">{t.heroBadge}</div>
    </header>
  );
}
