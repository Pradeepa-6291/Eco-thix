import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ImpactTracker from '../components/ImpactTracker';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const EMPTY_PRODUCT = {
  name: '', description: '', price: '', category: 'fashion',
  sustainabilityScore: 80, stock: 10, fairTradeBadges: '',
  image: '', oldPrice: '', badge: '',
  carbonSaved: '', treesPlanted: '', ecoCredits: '',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('impact');
  const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT);
  const [productMsg, setProductMsg] = useState('');

  const set = (field) => (e) => setNewProduct((p) => ({ ...p, [field]: e.target.value }));

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const ordersRes = await api.get('/orders/my');
        if (cancelled) return;
        setOrders(ordersRes.data);

        if (user.role === 'supplier' || user.role === 'admin') {
          const [productsRes, allOrdersRes] = await Promise.all([
            api.get('/products'),
            api.get('/orders/all'),
          ]);
          if (cancelled) return;
          setProducts(productsRes.data);
          setAllOrders(allOrdersRes.data);
        }

        if (user.role === 'admin') {
          const [allOrdersRes, usersRes] = await Promise.all([
            api.get('/orders'),
            api.get('/auth/users'),
          ]);
          if (cancelled) return;
          setAllOrders(allOrdersRes.data);
          setUsers(usersRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [user.role]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProductMsg('');
    try {
      const badges = newProduct.fairTradeBadges.split(',').map((b) => b.trim()).filter(Boolean);
      await api.post('/products', {
        ...newProduct,
        price: Number(newProduct.price),
        oldPrice: newProduct.oldPrice ? Number(newProduct.oldPrice) : undefined,
        sustainabilityScore: Number(newProduct.sustainabilityScore),
        stock: Number(newProduct.stock),
        fairTradeBadges: badges,
        image: newProduct.image.trim(),
        carbonSaved: newProduct.carbonSaved ? Number(newProduct.carbonSaved) : 0,
        treesPlanted: newProduct.treesPlanted ? Number(newProduct.treesPlanted) : 0,
        ecoCredits: newProduct.ecoCredits ? Number(newProduct.ecoCredits) : 0,
      });
      setProductMsg('✅ Product added successfully!');
      setNewProduct(EMPTY_PRODUCT);
    } catch (err) {
      setProductMsg('❌ ' + (err.response?.data?.message || 'Failed to add product'));
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setAllOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status } : o));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const TABS = [
    { id: 'impact', label: '🌍 Impact', roles: ['user', 'supplier', 'admin'] },
    { id: 'orders', label: '📦 My Orders', roles: ['user', 'supplier', 'admin'] },
    { id: 'myproducts', label: '📋 My Products', roles: ['supplier', 'admin'] },
    { id: 'products', label: '➕ Add Product', roles: ['supplier', 'admin'] },
    { id: 'allorders', label: '🚚 Manage Orders', roles: ['supplier', 'admin'] },
    { id: 'manage', label: '⚙️ Order Status', roles: ['admin'] },
    { id: 'users', label: '👥 Users', roles: ['admin'] },
  ].filter((t) => t.roles.includes(user.role));

  if (loading) return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="h-8 bg-gray-100 rounded animate-pulse mb-4 w-48" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {user.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}! 👋</h1>
          <p className="text-gray-500 capitalize">
            {user.role} Dashboard · <span className="text-primary font-semibold">🌱 {user.ecoCredits} eco-credits</span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${tab === t.id ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-eco-bg border border-gray-200'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Impact Tab ── */}
      {tab === 'impact' && <ImpactTracker orders={orders} user={user} />}

      {/* ── My Orders Tab ── */}
      {tab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-700">My Orders ({orders.length})</h2>
          {orders.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">📦</div>
              <p>No orders yet. Start shopping!</p>
            </div>
          ) : orders.map((order) => (
            <div key={order._id} className="card p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-400">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`badge ${STATUS_COLORS[order.status]}`}>{order.status}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {order.products.map((p, i) => (
                  <span key={i} className="text-sm bg-gray-50 px-3 py-1 rounded-full">{p.name} ×{p.quantity}</span>
                ))}
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex gap-4 text-green-600">
                  <span>🌳 {order.treesPlanted} trees</span>
                  <span>☁️ {order.carbonSaved} kg CO₂</span>
                  <span>🌱 +{order.ecoCreditsEarned} credits</span>
                </div>
                <span className="font-bold text-primary text-lg">${order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── My Products Tab ── */}
      {tab === 'myproducts' && (
        <div>
          <h2 className="text-xl font-bold text-gray-700 mb-6">My Products ({products.length})</h2>
          {products.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">🛍️</div>
              <p>No products yet. Add your first product!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p._id} className="card p-4">
                  <div className="relative mb-3">
                    <img
                      src={p.image || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400'}
                      alt={p.name}
                      className="w-full h-40 object-cover rounded-xl"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400'; }}
                    />
                    {p.badge && (
                      <span className="absolute top-2 left-2 badge bg-primary text-white text-xs">{p.badge}</span>
                    )}
                    <span className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-0.5 text-xs font-bold text-green-700">🌱 {p.sustainabilityScore}%</span>
                  </div>
                  <p className="text-xs text-gray-400 uppercase mb-1">{p.category}</p>
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{p.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-primary">${p.price?.toFixed(2)}</span>
                    {p.oldPrice && <span className="text-xs text-gray-400 line-through">${p.oldPrice?.toFixed(2)}</span>}
                    <span className="ml-auto text-xs text-gray-400">📦 Stock: {p.stock}</span>
                  </div>
                  <div className="flex gap-2 text-xs text-gray-500 mb-3">
                    {p.carbonSaved > 0 && <span>☁️ {p.carbonSaved}kg CO₂</span>}
                    {p.treesPlanted > 0 && <span>🌳 {p.treesPlanted} trees</span>}
                    {p.ecoCredits > 0 && <span>🌱 +{p.ecoCredits} credits</span>}
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(p._id)}
                    className="w-full py-2 rounded-full text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200"
                  >
                    🗑️ Delete Product
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Add Product Tab ── */}
      {tab === 'products' && (
        <div className="max-w-2xl">
          <h2 className="text-xl font-bold text-gray-700 mb-6">Add New Product</h2>

          {productMsg && (
            <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${productMsg.startsWith('✅') ? 'bg-eco-bg text-green-700' : 'bg-red-50 text-red-600'}`}>
              {productMsg}
            </div>
          )}

          <form onSubmit={handleAddProduct} className="card p-6 space-y-4">

            {/* Name + Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Product Name *</label>
                <input className="input" placeholder="Bamboo T-Shirt" value={newProduct.name} onChange={set('name')} required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Category *</label>
                <select className="input" value={newProduct.category} onChange={set('category')}>
                  {['fashion', 'home', 'tech', 'beauty', 'food', 'other'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description *</label>
              <textarea className="input resize-none" rows={3} placeholder="Product description..." value={newProduct.description} onChange={set('description')} required />
            </div>

            {/* Price + Eco Score + Stock */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Price ($) *</label>
                <input type="number" min="0" step="0.01" className="input" placeholder="49.99" value={newProduct.price} onChange={set('price')} required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Eco Score (0-100)</label>
                <input type="number" min="0" max="100" className="input" value={newProduct.sustainabilityScore} onChange={set('sustainabilityScore')} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Stock</label>
                <input type="number" min="0" className="input" value={newProduct.stock} onChange={set('stock')} />
              </div>
            </div>

            {/* Old Price + Badge */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Old Price ($) <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="number" min="0" step="0.01" className="input" placeholder="59.99" value={newProduct.oldPrice} onChange={set('oldPrice')} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Badge <span className="text-gray-400 font-normal">(optional)</span></label>
                <select className="input" value={newProduct.badge} onChange={set('badge')}>
                  <option value="">None</option>
                  {['Best Seller', 'Eco Choice', 'New', 'Sale'].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fair Trade Badges */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Fair Trade Badges <span className="text-gray-400 font-normal">(comma-separated)</span></label>
              <input className="input" placeholder="Fair Trade, B-Corp, Organic" value={newProduct.fairTradeBadges} onChange={set('fairTradeBadges')} />
            </div>

            {/* Eco Impact Fields */}
            <div className="bg-eco-bg rounded-2xl p-4 space-y-3">
              <p className="text-sm font-bold text-eco-dark">🌍 Eco Impact per Purchase</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">☁️ CO₂ Saved (kg)</label>
                  <input type="number" min="0" step="0.1" className="input text-sm" placeholder="e.g. 12.5" value={newProduct.carbonSaved} onChange={set('carbonSaved')} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">🌳 Trees Planted</label>
                  <input type="number" min="0" className="input text-sm" placeholder="e.g. 2" value={newProduct.treesPlanted} onChange={set('treesPlanted')} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">🌱 Eco Credits</label>
                  <input type="number" min="0" className="input text-sm" placeholder="e.g. 50" value={newProduct.ecoCredits} onChange={set('ecoCredits')} />
                </div>
              </div>
              {(newProduct.carbonSaved || newProduct.treesPlanted || newProduct.ecoCredits) && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-green-200">
                  {newProduct.carbonSaved && <span className="badge bg-blue-100 text-blue-700">☁️ {newProduct.carbonSaved} kg CO₂</span>}
                  {newProduct.treesPlanted && <span className="badge bg-green-100 text-green-700">🌳 {newProduct.treesPlanted} trees</span>}
                  {newProduct.ecoCredits && <span className="badge bg-emerald-100 text-emerald-700">🌱 +{newProduct.ecoCredits} credits</span>}
                </div>
              )}
            </div>

            {/* Image URL */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Product Image URL <span className="text-gray-400 font-normal">(optional)</span></label>
              <input className="input" placeholder="https://images.unsplash.com/photo-xxx?w=400" value={newProduct.image} onChange={set('image')} />
              {newProduct.image.trim() && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={newProduct.image.trim()}
                    alt="Preview"
                    className="h-24 w-24 object-cover rounded-xl border-2 border-primary"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400'; }}
                  />
                  <p className="text-xs text-green-600 font-medium">✅ Image preview</p>
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary w-full py-3 text-base">🌱 Add Product</button>
          </form>
        </div>
      )}

      {/* ── Supplier+Admin: Manage Orders ── */}
      {tab === 'allorders' && (
        <div>
          <h2 className="text-xl font-bold text-gray-700 mb-6">📦 All Orders ({allOrders.length})</h2>
          {allOrders.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">📋</div>
              <p>No orders yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allOrders.map((order) => (
                <div key={order._id} className="card p-5">
                  <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                    <div>
                      <p className="font-bold text-gray-700">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm text-gray-500">{order.userId?.name} · {order.userId?.email}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`badge ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                      <span className={`badge ${order.paymentMethod === 'cod' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {order.paymentMethod === 'cod' ? '💵 COD' : '💳 Paid'}
                      </span>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {order.products.map((p, i) => (
                      <div key={i} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full text-sm">
                        {p.image && <img src={p.image} alt={p.name} className="w-5 h-5 rounded-full object-cover" />}
                        <span>{p.name} ×{p.quantity}</span>
                        <span className="text-primary font-semibold">${(p.price * p.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <p className="text-xs text-gray-400 mb-3">📍 {order.shippingAddress}</p>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-bold text-primary text-lg">${order.totalAmount?.toFixed(2)}</span>

                    {/* Status Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {order.status === 'pending' && (
                        <button onClick={() => handleStatusUpdate(order._id, 'processing')} className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold hover:bg-blue-200 transition-colors">
                          ⚙️ Mark Processing
                        </button>
                      )}
                      {order.status === 'processing' && (
                        <button onClick={() => handleStatusUpdate(order._id, 'shipped')} className="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold hover:bg-purple-200 transition-colors">
                          🚚 Mark Shipped
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button onClick={() => handleStatusUpdate(order._id, 'delivered')} className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold hover:bg-green-200 transition-colors">
                          ✅ Mark Delivered
                        </button>
                      )}
                      {!['delivered', 'cancelled'].includes(order.status) && (
                        <button onClick={() => handleStatusUpdate(order._id, 'cancelled')} className="px-4 py-1.5 bg-red-100 text-red-600 rounded-full text-xs font-semibold hover:bg-red-200 transition-colors">
                          ✕ Cancel
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-semibold">✅ Delivered</span>
                      )}
                      {order.status === 'cancelled' && (
                        <span className="px-4 py-1.5 bg-red-50 text-red-400 rounded-full text-xs font-semibold">✕ Cancelled</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Admin: Manage Orders (dropdown) ── */}
      {tab === 'manage' && user.role === 'admin' && (
        <div>
          <h2 className="text-xl font-bold text-gray-700 mb-6">All Orders ({allOrders.length})</h2>
          {allOrders.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">📋</div>
              <p>No orders yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allOrders.map((order) => (
                <div key={order._id} className="card p-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-700">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-gray-400">{order.userId?.name} · ${order.totalAmount?.toFixed(2)}</p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className="input w-auto text-sm py-2"
                  >
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Admin: Users ── */}
      {tab === 'users' && user.role === 'admin' && (
        <div>
          <h2 className="text-xl font-bold text-gray-700 mb-6">All Users ({users.length})</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-eco-bg">
                <tr>
                  {['Name', 'Email', 'Role', 'Eco Credits', 'Trees', 'Joined'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${u.role === 'admin' ? 'bg-red-100 text-red-700' : u.role === 'supplier' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-primary font-semibold">{u.ecoCredits}</td>
                    <td className="px-4 py-3">🌳 {u.treesPlanted}</td>
                    <td className="px-4 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
