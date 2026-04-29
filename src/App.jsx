import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchInput from './components/SearchInput';
import ResultsGrid from './components/ResultsGrid';
import EdgeCaseMessage from './components/EdgeCaseMessage';
import LoadingState from './components/LoadingState';
import CatalogGrid from './components/CatalogGrid';
import { getRecommendations } from './services/llmService';
import { translations } from './i18n/translations';
import './App.css';

// Detect system preference
const getSystemTheme = () =>
  window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export default function App() {
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState(() => localStorage.getItem('mss-theme') || getSystemTheme());
  const [state, setState] = useState('idle'); // idle | loading | results | edge | error
  const [result, setResult] = useState(null);
  const [query, setQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [spotlightIds, setSpotlightIds] = useState([]);

  const t = translations[lang];

  // Apply direction to document root
  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = t.lang;
  }, [lang, t]);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mss-theme', theme);
  }, [theme]);

  const handleSearch = async (userQuery) => {
    setQuery(userQuery);
    setState('loading');
    setResult(null);
    setSpotlightIds([]);
    setErrorMsg('');

    try {
      const data = await getRecommendations(userQuery);

      if (data.type === 'recommendations' && data.recommendations?.length > 0) {
        setResult(data);
        // Extract product IDs for spotlight effect
        const ids = data.recommendations.map(r => r.product_id);
        setSpotlightIds(ids);
        setState('results');
      } else if (data.type === 'edge_case') {
        setResult(data);
        setState('edge');
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      console.error('LLM Error:', err);
      setErrorMsg(err.message || 'Unknown error');
      setState('error');
    }
  };

  const handleReset = () => {
    setState('idle');
    setResult(null);
    setQuery('');
    setErrorMsg('');
    setSpotlightIds([]);
  };

  const toggleLang = () => setLang(l => l === 'en' ? 'ar' : 'en');
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const isLoading = state === 'loading';

  return (
    <div className={`app ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Background effects */}
      <div className="bg-orbs">
        <div className="bg-orb orb-a" />
        <div className="bg-orb orb-b" />
        <div className="bg-orb orb-c" />
      </div>

      <div className="container">
        <Header
          t={t}
          lang={lang}
          onToggleLang={toggleLang}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main className="main">
          {/* Search — always visible */}
          <SearchInput
            t={t}
            onSearch={handleSearch}
            loading={isLoading}
          />

          {/* Loading indicator */}
          {isLoading && <LoadingState t={t} />}

          {/* AI Results (top 3 detailed cards) */}
          {state === 'results' && result && (
            <ResultsGrid
              result={result}
              query={query}
              t={t}
              lang={lang}
              onReset={handleReset}
            />
          )}

          {/* Edge case message */}
          {state === 'edge' && result && (
            <EdgeCaseMessage
              result={result}
              t={t}
              lang={lang}
              onReset={handleReset}
            />
          )}

          {/* Error state */}
          {state === 'error' && (
            <div className="error-card">
              <span className="error-icon">❌</span>
              <h3 className="error-title">{t.errorTitle}</h3>
              <p className="error-msg">{errorMsg}</p>
              <button className="reset-btn" onClick={handleReset}>{t.errorRetry}</button>
            </div>
          )}

          {/* Catalog — always visible, spotlight applied when results exist */}
          <CatalogGrid
            t={t}
            lang={lang}
            spotlightIds={spotlightIds}
            isLoading={isLoading}
          />
        </main>

        <footer className="footer">
          <p className="footer-powered">{t.poweredBy}</p>
          <p className="footer-disclaimer">{t.disclaimer}</p>
        </footer>
      </div>
    </div>
  );
}
