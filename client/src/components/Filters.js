import React from 'react';

export default function Filters({ filters, setFilters }) {
  const categories = ['all', 'fashion', 'home', 'tech', 'beauty', 'food', 'other'];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-20">
      <h3 className="font-bold text-gray-800 mb-4 text-lg">🔍 Filters</h3>

      {/* Category */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Category</p>
        <div className="flex flex-col gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilters((f) => ({ ...f, category: cat }))}
              className={`text-left px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filters.category === cat
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-eco-bg hover:text-primary'
              }`}
            >
              {cat === 'all' ? '🌍 All Products' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Eco Score */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
          Min Eco Score: <span className="text-primary">{filters.minScore}</span>
        </p>
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={filters.minScore}
          onChange={(e) => setFilters((f) => ({ ...f, minScore: Number(e.target.value) }))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0</span><span>50</span><span>100</span>
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Max Price: <span className="text-primary">${filters.maxPrice}</span></p>
        <input
          type="range"
          min="10"
          max="500"
          step="10"
          value={filters.maxPrice}
          onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>$10</span><span>$500</span>
        </div>
      </div>

      <button
        onClick={() => setFilters({ category: 'all', minScore: 0, maxPrice: 500, search: '' })}
        className="w-full btn-outline text-sm py-2"
      >
        Reset Filters
      </button>
    </div>
  );
}
