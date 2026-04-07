import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Filters from '../components/Filters';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: 'all', minScore: 0, maxPrice: 500, search: '' });

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filters.category !== 'all') params.category = filters.category;
    if (filters.minScore > 0) params.minScore = filters.minScore;
    if (filters.search) params.search = filters.search;

    api.get('/products', { params })
      .then((res) => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filters.category, filters.minScore, filters.search]);

  const filtered = products.filter((p) => p.price <= filters.maxPrice);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="section-title">🛍️ Eco Products</h1>
        <p className="text-gray-500">Discover {filtered.length} sustainable products</p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          className="input pl-10 max-w-lg"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
        />
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Filters filters={filters} setFilters={setFilters} />
        </div>

        {/* Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card h-80 animate-pulse bg-gray-100" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-400">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
