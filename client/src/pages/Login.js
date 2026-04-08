import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email: form.email, password: form.password } : form;
      const { data } = await api.post(endpoint, payload);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eco-bg via-white to-primary-light flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-eco-dark to-green-700 text-white flex-col justify-center px-16">
        <div className="text-4xl font-extrabold mb-2">🌿 ECO<span className="text-accent">THIX</span></div>
        <h2 className="text-3xl font-bold mb-4 leading-tight">Join the Green<br />Revolution</h2>
        <p className="text-white/80 mb-8">Shop sustainably, live ethically, and make a real impact on our planet.</p>
        <div className="space-y-3 mb-10">
          {['Earn eco-credits with every purchase', 'Track your environmental impact', 'Support verified ethical brands'].map((f) => (
            <div key={f} className="flex items-center gap-3">
              <span className="text-accent text-xl">✓</span>
              <span className="text-white/90">{f}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-8">
          {[['50K+', 'Eco Warriors'], ['8,942', 'Trees Planted'], ['100%', 'Carbon Neutral']].map(([v, l]) => (
            <div key={l} className="text-center">
              <div className="text-2xl font-bold text-accent">{v}</div>
              <div className="text-xs text-white/70">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="text-3xl font-extrabold text-eco-dark">🌿 ECO<span className="text-primary">THIX</span></div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {isLogin ? 'Welcome Back 👋' : 'Create Account 🌱'}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {isLogin ? 'Continue your sustainable journey' : 'Start making a difference today'}
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                  <input
                    className="input"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              {!isLogin && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Account Type</label>
                  <select
                    className="input"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="user">🛍️ Shopper</option>
                    <option value="supplier">🏭 Supplier</option>
                  </select>
                </div>
              )}
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
                {loading ? '⏳ Please wait...' : isLogin ? '🔐 Login' : '🌱 Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-primary font-semibold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}