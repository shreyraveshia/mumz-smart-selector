import React from 'react';

export default function MiniProductCard({ product, lang, t, state }) {
  // state: 'normal' | 'spotlight' | 'dimmed'
  const name = lang === 'ar' ? product.name_ar : product.name;
  const tag = lang === 'ar' ? product.tag_ar : product.tag;
  const category = t.categories?.[product.category] || product.category;

  return (
    <div className={`mini-card mini-card--${state}`}>
      {state === 'spotlight' && <div className="mini-card-glow" />}

      {/* Rank badge shown on spotlight cards */}
      {state === 'spotlight' && (
        <div className="mini-card-ai-badge">🤖 AI Pick</div>
      )}

      <div className="mini-card-emoji">{product.image_emoji}</div>

      {tag && state !== 'dimmed' && (
        <span className="mini-card-tag">{tag}</span>
      )}

      <h4 className="mini-card-name">{name}</h4>
      <span className="mini-card-category">{category}</span>

      <div className="mini-card-meta">
        <span className="mini-card-price">
          {product.currency} {product.price.toLocaleString()}
        </span>
        <span className="mini-card-age">
          {t.ageLabel}: {product.age_range}
        </span>
      </div>

      <div className="mini-card-features">
        {product.features.slice(0, 2).map((f, i) => (
          <span key={i} className="mini-feature-chip">{f}</span>
        ))}
      </div>
    </div>
  );
}
