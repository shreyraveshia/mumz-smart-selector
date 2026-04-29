import React from 'react';

export default function LoadingState({ t }) {
  return (
    <div className="loading-state">
      <div className="loading-orb">
        <div className="orb-ring ring1" />
        <div className="orb-ring ring2" />
        <div className="orb-ring ring3" />
        <span className="orb-emoji">🤖</span>
      </div>
      <p className="loading-title">{t.findButtonLoading}</p>
      <div className="loading-dots">
        <span /><span /><span />
      </div>
      <p className="loading-hint">Analyzing {25} products with AI…</p>
    </div>
  );
}
