import React, { useState, useMemo } from 'react';
import { products } from '../data/products';
import MiniProductCard from './MiniProductCard';

const CATEGORIES = ['all', 'stroller', 'car_seat', 'carrier', 'feeding', 'toys'];

export default function CatalogGrid({ t, lang, spotlightIds = [], isLoading = false }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const hasSpotlight = spotlightIds.length > 0;

  const getState = (productId) => {
    if (!hasSpotlight) return 'normal';
    return spotlightIds.includes(productId) ? 'spotlight' : 'dimmed';
  };

  return (
    <section className="catalog-section">
      {/* Section header */}
      <div className="catalog-header">
        <div className="catalog-title-group">
          <h2 className="catalog-title">{t.catalogTitle}</h2>
          <span className="catalog-subtitle">{t.catalogSubtitle}</span>
        </div>
        {hasSpotlight && (
          <div className="catalog-spotlight-note">
            ✨ {t.catalogSpotlightNote}
          </div>
        )}
      </div>

      {/* Category filter tabs */}
      <div className="category-tabs" role="tablist">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {t.categoryTabs?.[cat] || cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className={`catalog-grid ${isLoading ? 'catalog-loading' : ''}`}>
        {filtered.map(product => (
          <MiniProductCard
            key={product.id}
            product={product}
            lang={lang}
            t={t}
            state={getState(product.id)}
          />
        ))}
      </div>
    </section>
  );
}
