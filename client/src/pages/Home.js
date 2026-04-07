import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const STATS = [
  { icon: '🌳', value: '8,942', label: 'Trees Planted' },
  { icon: '♻️', value: '12.5K', label: 'Tons Recycled' },
  { icon: '👥', value: '50K+', label: 'Eco Warriors' },
  { icon: '🌍', value: '100%', label: 'Carbon Neutral' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?limit=8')
      .then((res) => setProducts(res.data.slice(0, 8)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-eco-dark via-green-800 to-primary min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/30">
              🌍 Carbon Neutral Shipping on All Orders
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              Shop with<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-accent">
                Purpose
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Every purchase plants a tree, supports ethical artisans, and offsets your carbon footprint.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="bg-white text-eco-dark px-8 py-4 rounded-full font-bold text-lg hover:bg-primary hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                🛍️ Shop Now
              </Link>
              <Link to="/suppliers" className="border-2 border-white/50 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300">
                🌱 Our Impact
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Ticker */}
      <div className="bg-eco-dark text-white py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <div className="font-bold text-accent text-lg">{s.value}</div>
                <div className="text-xs text-white/70">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: '🌿', title: '100% Sustainable', desc: 'Every product is ethically sourced and eco-certified', color: 'bg-green-50' },
              { icon: '🚚', title: 'Carbon-Neutral Delivery', desc: 'We offset all shipping emissions automatically', color: 'bg-blue-50' },
              { icon: '🏆', title: 'Verified Brands', desc: 'All sellers certified for ethical practices', color: 'bg-yellow-50' },
              { icon: '💚', title: 'Earn Eco-Credits', desc: 'Get rewards with every sustainable purchase', color: 'bg-purple-50' },
            ].map((f) => (
              <div key={f.title} className={`${f.color} rounded-2xl p-6 text-center hover:-translate-y-2 transition-transform duration-300`}>
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="section-title">🌟 Trending Eco Products</h2>
              <p className="text-gray-500">Curated sustainable goods for conscious living</p>
            </div>
            <Link to="/products" className="btn-outline text-sm">View All →</Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card h-80 animate-pulse bg-gray-100" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products yet</h3>
              <p className="text-gray-400">Products will appear here once added by suppliers.</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="section-title text-center mb-2">💬 Eco Warriors Speak</h2>
          <p className="text-center text-gray-500 mb-10">Real stories from our community</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah J.', text: 'Ecothix changed how I shop. Knowing my purchases help the planet makes every buy meaningful!', trees: 45, avatar: 'S' },
              { name: 'Mike C.', text: 'Love the transparency! I can see exactly where my products come from and their environmental impact.', trees: 32, avatar: 'M' },
              { name: 'Emma D.', text: 'The quality is amazing and I feel good about supporting ethical brands. Win-win!', trees: 67, avatar: 'E' },
            ].map((t) => (
              <div key={t.name} className="card p-6 border-l-4 border-primary">
                <div className="text-yellow-400 text-lg mb-3">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-600 italic mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">{t.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-800">{t.name}</div>
                    <div className="text-xs text-primary">🌳 {t.trees} trees planted</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-eco-dark to-green-700 text-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-3">Join the Green Revolution 🌿</h2>
          <p className="text-white/80 mb-6">Get exclusive eco-deals and sustainability tips</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-full text-gray-800 outline-none text-sm" />
            <button className="bg-accent text-white px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}
