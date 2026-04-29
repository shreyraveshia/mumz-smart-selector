import React from 'react';
import ProductCard from './ProductCard';

export default function ResultsGrid({ result, query, t, lang, onReset }) {
  const understood = lang === 'ar'
    ? result.query_understood_ar
    : result.query_understood_en;

  return (
    <div className="results-section">
      <div className="results-header">
        <h2 className="results-title">{t.resultsTitle}</h2>
        <p className="results-subtitle">{t.resultsSubtitle(query)}</p>
        {understood && (
          <div className="understood-box">
            <span className="understood-label">{t.queryUnderstood}</span>
            <span className="understood-text">{understood}</span>
          </div>
        )}
      </div>

      <div className="cards-grid">
        {result.recommendations.map((rec) => (
          <ProductCard
            key={rec.product_id}
            rec={rec}
            rank={rec.rank}
            t={t}
            lang={lang}
          />
        ))}
      </div>

      <button className="reset-btn" onClick={onReset}>
        🔄 {t.tryAgain}
      </button>
    </div>
  );
}
