import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const CATEGORY_IMAGES = {
  fashion: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
  home: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600',
  tech: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600',
  beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600',
  food: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
  other: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600',
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />)}
        </div>
      </div>
    </div>
  );

  if (!product) return null;

  const score = product.sustainabilityScore || 0;
  const scoreColor = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-400';
  const imgSrc = product.image || CATEGORY_IMAGES[product.category] || CATEGORY_IMAGES.other;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <button onClick={() => navigate(-1)} className="text-primary hover:underline mb-6 flex items-center gap-2 font-medium">
        ← Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative">
          <img src={imgSrc} alt={product.name} className="w-full h-96 object-cover rounded-2xl shadow-lg"
            onError={(e) => { e.target.src = CATEGORY_IMAGES.other; }} />
          {product.badge && (
            <span className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
              {product.badge}
            </span>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm text-gray-400 uppercase tracking-wide mb-1">{product.category}</p>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>

          {/* Supplier */}
          {product.supplierId && (
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
              <span>🏭</span>
              <span>By <strong className="text-primary">{product.supplierId.name}</strong> · {product.supplierId.location}</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl font-extrabold text-primary">${product.price?.toFixed(2)}</span>
            {product.oldPrice && <span className="text-xl text-gray-400 line-through">${product.oldPrice?.toFixed(2)}</span>}
          </div>

          {/* Eco Score */}
          <div className="bg-eco-bg rounded-xl p-4 mb-4">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-eco-dark">🌱 Sustainability Score</span>
              <span className="font-bold text-primary text-lg">{score}/100</span>
            </div>
            <div className="h-3 bg-white rounded-full overflow-hidden">
              <div className={`h-full ${scoreColor} rounded-full`} style={{ width: `${score}%` }} />
            </div>
          </div>

          {/* Fair Trade Badges */}
          {product.fairTradeBadges?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600 mb-2">Certifications:</p>
              <div className="flex flex-wrap gap-2">
                {product.fairTradeBadges.map((b) => (
                  <span key={b} className="badge bg-green-100 text-green-700">✓ {b}</span>
                ))}
              </div>
            </div>
          )}

          {/* Eco Impact */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">☁️</div>
              <div className="font-bold text-blue-700 text-sm">{product.carbonSaved || (product.price * 0.5).toFixed(1)} kg</div>
              <div className="text-xs text-blue-500">CO₂ Saved</div>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">🌳</div>
              <div className="font-bold text-green-700 text-sm">{product.treesPlanted || 0}</div>
              <div className="text-xs text-green-500">Trees Planted</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">🌱</div>
              <div className="font-bold text-emerald-700 text-sm">+{product.ecoCredits || 0}</div>
              <div className="text-xs text-emerald-500">Eco Credits</div>
            </div>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
            <span>📦 Stock: <strong className="text-gray-700">{product.stock}</strong></span>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          {/* Supplier Certifications */}
          {product.supplierId?.certifications?.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-sm font-semibold text-blue-700 mb-2">🏅 Supplier Certifications</p>
              <div className="flex flex-wrap gap-2">
                {product.supplierId.certifications.map((c) => (
                  <span key={c} className="badge bg-blue-100 text-blue-700">{c}</span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`btn-primary w-full py-4 text-lg ${added ? 'bg-green-600' : ''}`}
          >
            {added ? '✅ Added to Cart!' : product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
