import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const BADGE_COLORS = {
  'Best Seller': 'bg-yellow-100 text-yellow-800',
  'Eco Choice': 'bg-green-100 text-green-800',
  'New': 'bg-blue-100 text-blue-800',
  'Sale': 'bg-red-100 text-red-800',
};

const CATEGORY_IMAGES = {
  fashion: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
  home: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400',
  tech: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
  beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
  food: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
  other: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400',
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const score = product.sustainabilityScore || 0;
  const scoreColor = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-400';
  const imgSrc = product.image || CATEGORY_IMAGES[product.category] || CATEGORY_IMAGES.other;

  return (
    <div className="card overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = CATEGORY_IMAGES.other; }}
        />
        {product.badge && (
          <span className={`badge absolute top-3 left-3 ${BADGE_COLORS[product.badge] || 'bg-gray-100 text-gray-700'}`}>
            {product.badge}
          </span>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-bold text-green-700">
          🌱 {score}%
        </div>
      </div>

      <div className="p-4">
        {/* Sustainability Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Eco Score</span>
            <span className="font-semibold text-green-600">{score}/100</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full ${scoreColor} rounded-full transition-all duration-700`} style={{ width: `${score}%` }} />
          </div>
        </div>

        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{product.category}</p>
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>

        {/* Fair Trade Badges */}
        {product.fairTradeBadges?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.fairTradeBadges.slice(0, 2).map((b) => (
              <span key={b} className="badge bg-eco-bg text-eco-dark text-xs">✓ {b}</span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-primary">${product.price?.toFixed(2)}</span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">${product.oldPrice?.toFixed(2)}</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <span>☁️ {product.carbonSaved || (product.price * 0.5).toFixed(1)} kg CO₂</span>
          {product.treesPlanted > 0 && <span>🌳 {product.treesPlanted} trees</span>}
          {product.ecoCredits > 0 && <span>🌱 +{product.ecoCredits} credits</span>}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 btn-primary text-sm py-2"
          >
            Add to Cart
          </button>
          <Link
            to={`/products/${product._id}`}
            className="px-3 py-2 border-2 border-gray-200 rounded-full hover:border-primary hover:text-primary transition-colors text-sm"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
