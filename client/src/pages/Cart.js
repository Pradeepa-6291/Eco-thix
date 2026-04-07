import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart, total, count } = useCart();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  // Snapshot of impact values saved BEFORE cart is cleared
  const [impact, setImpact] = useState(null);

  const carbonSaved = parseFloat((total * 0.5).toFixed(2));
  const treesPlanted = Math.floor(total / 20);
  const creditsEarned = Math.floor(total / 10);

  const handleCheckout = async () => {
    if (!user) return navigate('/login');
    if (!address.trim()) return alert('Please enter a shipping address');
    setLoading(true);
    try {
      const { data: order } = await api.post('/orders', {
        products: cart.map((i) => ({
          productId: i._id,
          name: i.name,
          price: i.price,
          quantity: i.qty,
          image: i.image || '',
        })),
        totalAmount: total,
        shippingAddress: address,
      });

      // Save real values returned from backend BEFORE clearing cart
      setImpact({
        treesPlanted: order.treesPlanted,
        carbonSaved: order.carbonSaved,
        creditsEarned: order.ecoCreditsEarned,
        totalAmount: order.totalAmount,
      });

      clearCart();
      refreshUser();
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  // Show success screen using backend-returned values
  if (impact) return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <div className="text-7xl mb-6">🎉</div>
      <h2 className="text-3xl font-bold text-gray-800 mb-3">Order Confirmed!</h2>
      <p className="text-gray-500 mb-6">Thank you for shopping sustainably!</p>

      <div className="bg-eco-bg rounded-2xl p-6 mb-6 space-y-3">
        <p className="text-lg font-bold text-eco-dark mb-2">🌿 Your Eco Impact</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-100 rounded-xl p-3">
            <div className="text-2xl mb-1">🌳</div>
            <div className="text-xl font-bold text-green-700">{impact.treesPlanted}</div>
            <div className="text-xs text-green-600">Trees Planted</div>
          </div>
          <div className="bg-blue-100 rounded-xl p-3">
            <div className="text-2xl mb-1">☁️</div>
            <div className="text-xl font-bold text-blue-700">{impact.carbonSaved} kg</div>
            <div className="text-xs text-blue-600">CO₂ Offset</div>
          </div>
          <div className="bg-emerald-100 rounded-xl p-3">
            <div className="text-2xl mb-1">🌱</div>
            <div className="text-xl font-bold text-emerald-700">+{impact.creditsEarned}</div>
            <div className="text-xs text-emerald-600">Eco Credits</div>
          </div>
        </div>
        <p className="text-sm text-gray-500 pt-2">
          Order total: <strong className="text-primary">${impact.totalAmount?.toFixed(2)}</strong>
        </p>
      </div>

      <div className="flex gap-3 justify-center">
        <Link to="/products" className="btn-primary">Continue Shopping</Link>
        <Link to="/dashboard" className="btn-outline">View Orders</Link>
      </div>
    </div>
  );

  if (count === 0) return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <div className="text-7xl mb-6">🛒</div>
      <h2 className="text-2xl font-bold text-gray-700 mb-3">Your cart is empty</h2>
      <p className="text-gray-400 mb-6">Add some eco-friendly products!</p>
      <Link to="/products" className="btn-primary">Shop Now</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="section-title mb-8">🛒 Your Cart ({count} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item._id} className="card p-4 flex gap-4">
              <img
                src={item.image || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200'}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200'; }}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-400 capitalize">{item.category}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-eco-bg text-eco-dark px-2 py-0.5 rounded-full">🌱 {item.sustainabilityScore}% eco</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item._id, item.qty - 1)} className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-primary flex items-center justify-center font-bold transition-colors">−</button>
                    <span className="w-8 text-center font-semibold">{item.qty}</span>
                    <button onClick={() => updateQty(item._id, item.qty + 1)} className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-primary flex items-center justify-center font-bold transition-colors">+</button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-primary text-lg">${(item.price * item.qty).toFixed(2)}</span>
                    <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600 transition-colors text-sm">✕ Remove</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>${total.toFixed(2)}</span></div>
              <div className="flex justify-between text-green-600"><span>🌍 Carbon Offset</span><span>Free</span></div>
              <div className="flex justify-between text-green-600"><span>🚚 Eco Shipping</span><span>Free</span></div>
              <hr />
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary">${total.toFixed(2)}</span></div>
            </div>

            {/* Impact Preview */}
            <div className="bg-eco-bg rounded-xl p-3 mb-4 space-y-1 text-sm">
              <p className="font-semibold text-eco-dark mb-2">🌿 Your Impact</p>
              <p className="text-green-700">🌳 {treesPlanted} trees will be planted</p>
              <p className="text-blue-700">☁️ {carbonSaved} kg CO₂ offset</p>
              <p className="text-primary">🌱 +{creditsEarned} eco-credits</p>
            </div>

            <input
              className="input mb-3 text-sm"
              placeholder="Shipping address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <button onClick={handleCheckout} disabled={loading} className="btn-primary w-full py-3">
              {loading ? '⏳ Processing...' : '🔐 Checkout'}
            </button>

            {!user && <p className="text-xs text-center text-gray-400 mt-2">You'll be asked to login</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
