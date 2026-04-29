import React, { useState, useRef, useEffect } from 'react';

export default function SearchInput({ t, onSearch, loading }) {
  const [query, setQuery] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !loading) onSearch(query.trim());
  };

  const handleChipClick = (chip) => {
    setQuery(chip);
    setTimeout(() => onSearch(chip), 100);
  };

  return (
    <div className="search-section">
      <p className="search-subtitle">{t.subtitle}</p>

      <div className="example-chips">
        {t.exampleQueries.map((q, i) => (
          <button
            key={i}
            className="chip"
            onClick={() => handleChipClick(q)}
            disabled={loading}
          >
            {q}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-box">
          <textarea
            ref={textareaRef}
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.inputPlaceholder}
            rows={2}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            className={`search-btn ${loading ? 'loading' : ''}`}
            disabled={!query.trim() || loading}
          >
            {loading ? (
              <>
                <span className="spinner" />
                {t.findButtonLoading}
              </>
            ) : (
              <>
                <span className="btn-icon">🎯</span>
                {t.findButton}
              </>
            )}
          </button>
        </div>
      </form>

      <div className="how-it-works">
        <span className="how-label">{t.howItWorks}:</span>
        <div className="steps">
          {t.steps.map((step, i) => (
            <React.Fragment key={i}>
              <div className="step">
                <span className="step-icon">{step.icon}</span>
                <span className="step-label">{step.label}</span>
              </div>
              {i < t.steps.length - 1 && <span className="step-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
