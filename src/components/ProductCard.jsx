import React, { useState } from 'react';
import { products as allProducts } from '../data/products';

export default function ProductCard({ rec, rank, t, lang }) {
  const [flipped, setFlipped] = useState(false);
  const product = allProducts.find(p => p.id === rec.product_id);
  const emoji = product?.image_emoji || '📦';
  const tagLabel = lang === 'ar' ? product?.tag_ar : product?.tag;
  const category = t.categories[product?.category] || product?.category;

  const reason = lang === 'ar' ? rec.reason_ar : rec.reason_en;
  const safetyNote = lang === 'ar' ? rec.safety_note_ar : rec.safety_note_en;
  const highlights = lang === 'ar' ? rec.match_highlights_ar : rec.match_highlights;
  const budgetLabel = t.budgetFit[rec.budget_fit] || '';
  const rankLabel = t.rank[rank - 1];

  const rankClass = rank === 1 ? 'rank-gold' : rank === 2 ? 'rank-silver' : 'rank-bronze';

  return (
    <div className={`product-card ${rankClass} ${flipped ? 'flipped' : ''}`}>
      {/* Glow accent */}
      <div className="card-glow" />

      {/* Rank badge */}
      <div className="rank-badge">{rankLabel}</div>

      {/* Category tag */}
      {tagLabel && <div className="product-tag">{tagLabel}</div>}

      {/* Product emoji / visual */}
      <div className="product-emoji-wrap">
        <span className="product-emoji">{emoji}</span>
        <div className="emoji-bg" />
      </div>

      {/* Product name */}
      <h3 className="product-name">
        {lang === 'ar' ? rec.name_ar : rec.name}
      </h3>
      <span className="product-category">{category}</span>

      {/* Reason */}
      <div className="reason-box">
        <span className="reason-label">{t.whyFits}</span>
        <p className="reason-text">{reason}</p>
      </div>

      {/* Safety */}
      <div className="safety-box">
        <span className="safety-icon">🛡️</span>
        <div>
          <span className="safety-label">{t.safetyNote}: </span>
          <span className="safety-text">{safetyNote}</span>
        </div>
      </div>

      {/* Highlights chips */}
      {highlights && highlights.length > 0 && (
        <div className="highlights-row">
          {highlights.slice(0, 3).map((h, i) => (
            <span key={i} className="highlight-chip">{h}</span>
          ))}
        </div>
      )}

      {/* Footer: price + budget fit */}
      <div className="card-footer">
        <div className="price-block">
          <span className="price-label">{t.price}</span>
          <span className="price-value">
            {rec.currency} {rec.price?.toLocaleString()}
          </span>
        </div>
        <span className={`budget-badge budget-${rec.budget_fit}`}>
          {budgetLabel}
        </span>
      </div>
    </div>
  );
}
