import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/suppliers')
      .then((res) => setSuppliers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="section-title">🏭 Verified Suppliers</h1>
      <p className="text-gray-500 mb-8">All our suppliers are certified for ethical and sustainable practices</p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="card h-48 animate-pulse bg-gray-100" />)}
        </div>
      ) : suppliers.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🏭</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No suppliers yet</h3>
          <p className="text-gray-400">Suppliers will appear here once registered.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suppliers.map((s) => (
            <div key={s._id} className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {s.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{s.name}</h3>
                  <p className="text-sm text-gray-400">📍 {s.location}</p>
                </div>
                {s.verified && <span className="ml-auto badge bg-green-100 text-green-700">✓ Verified</span>}
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{s.description}</p>
              {s.certifications?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {s.certifications.map((c) => (
                    <span key={c} className="badge bg-eco-bg text-eco-dark text-xs">{c}</span>
                  ))}
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sustainability Rating</span>
                  <span className="font-bold text-primary">{s.sustainabilityRating}/100</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${s.sustainabilityRating}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
