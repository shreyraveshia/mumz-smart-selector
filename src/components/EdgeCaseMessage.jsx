import React from 'react';

export default function EdgeCaseMessage({ result, t, lang, onReset }) {
  const edgeType = result.edge_type;
  const info = t.edgeCase[edgeType] || t.edgeCase.vague_query;

  const message = lang === 'ar' ? result.message_ar : result.message_en;
  const suggestion = lang === 'ar' ? result.suggestion_ar : result.suggestion_en;
  const closestPrice = lang === 'ar' ? result.closest_price_ar : result.closest_price_en;

  const colorClass = {
    no_match: 'edge-nomatch',
    vague_query: 'edge-vague',
    conflicting: 'edge-conflict',
    out_of_scope: 'edge-scope',
  }[edgeType] || 'edge-vague';

  return (
    <div className={`edge-card ${colorClass}`}>
      <div className="edge-icon">{info.icon}</div>
      <h3 className="edge-title">{info.title}</h3>
      <p className="edge-message">{message}</p>

      {edgeType === 'no_match' && closestPrice && (
        <div className="edge-closest">
          <span>{info.closestLabel}:</span>
          <strong> {closestPrice}</strong>
        </div>
      )}

      {suggestion && (
        <div className="edge-suggestion">
          <span className="suggestion-label">{t.suggestionLabel}</span>
          <p className="suggestion-text">{suggestion}</p>
        </div>
      )}

      <button className="reset-btn edge-reset-btn" onClick={onReset}>
        🔄 {t.tryAgain}
      </button>
    </div>
  );
}
