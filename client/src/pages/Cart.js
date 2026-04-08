import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const STEPS = ['Cart', 'Shipping', 'Payment', 'Confirmed'];

function StepBar({ step }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`flex items-center gap-2 ${i <= step ? 'text-primary' : 'text-gray-300'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${i < step ? 'bg-primary border-primary text-white' : i === step ? 'border-primary text-primary bg-white' : 'border-gray-200 text-gray-300'}`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className="text-sm font-medium hidden sm:block">{s}</span>
          </div>
          {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 max-w-12 ${i < step ? 'bg-primary' : 'bg-gray-200'}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function Cart() {
  const { cart, removeFromCart, updateQty, clearCart, total, count } = useCart();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0); // 0=cart, 1=shipping, 2=payment, 3=confirmed
  const [address, setAddress] = useState({ fullName: '', street: '', city: '', state: '', zip: '', country: 'India' });
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [payMethod, setPayMethod] = useState('card'); // card | cod
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [impact, setImpact] = useState(null);

  const carbonSaved = parseFloat((total * 0.5).toFixed(2));
  const treesPlanted = Math.floor(total / 20);
  const creditsEarned = Math.floor(total / 10);

  // Format card number with spaces
  const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; };

  const validateAddress = () => {
    const { fullName, street, city, state, zip } = address;
    if (!fullName || !street || !city || !state || !zip) { setError('Please fill all address fields'); return false; }
    return true;
  };

  const validateCard = () => {
    if (payMethod === 'cod') return true;
    const num = card.number.replace(/\s/g, '');
    if (num.length < 16) { setError('Enter a valid 16-digit card number'); return false; }
    if (!card.name) { setError('Enter cardholder name'); return false; }
    if (card.expiry.length < 5) { setError('Enter valid expiry MM/YY'); return false; }
    if (card.cvv.length < 3) { setError('Enter valid CVV'); return false; }
    return true;
  };

  const handlePlaceOrder = async () => {
    setError('');
    if (!validateCard()) return;
    setLoading(true);
    try {
      // Simulate payment processing delay
      await new Promise((r) => setTimeout(r, 1500));

      const shippingAddress = `${address.fullName}, ${address.street}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`;
      const { data: order } = await api.post('/orders', {
        products: cart.map((i) => ({
          productId: i._id,
          name: i.name,
          price: i.price,
          quantity: i.qty,
          image: i.image || '',
        })),
        totalAmount: total,
        shippingAddress,
        paymentMethod: payMethod,
      });

      setImpact({
        treesPlanted: order.treesPlanted,
        carbonSaved: order.carbonSaved,
        creditsEarned: order.ecoCreditsEarned,
        totalAmount: order.totalAmount,
        orderId: order._id,
      });

      clearCart();
      refreshUser();
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 3: Confirmed ──
  if (step === 3 && impact) return (
    <div className="max-w-lg mx-auto px-6 py-16 text-center">
      <StepBar step={3} />
      <div className="text-7xl mb-4">🎉</div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
      <p className="text-gray-500 mb-2">Order <span className="font-mono font-bold text-primary">#{impact.orderId?.slice(-8).toUpperCase()}</span></p>
      <p className="text-gray-400 text-sm mb-6">
        {payMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Paid by Card'} · ${impact.totalAmount?.toFixed(2)}
      </p>
      <div className="bg-eco-bg rounded-2xl p-6 mb-6">
        <p className="text-sm font-bold text-eco-dark mb-4">🌿 Your Eco Impact</p>
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
      </div>
      <div className="flex gap-3 justify-center">
        <Link to="/products" className="btn-primary">Continue Shopping</Link>
        <Link to="/dashboard" className="btn-outline">View Orders</Link>
      </div>
    </div>
  );

  // ── Empty Cart ──
  if (count === 0 && step === 0) return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <div className="text-7xl mb-6">🛒</div>
      <h2 className="text-2xl font-bold text-gray-700 mb-3">Your cart is empty</h2>
      <p className="text-gray-400 mb-6">Add some eco-friendly products!</p>
      <Link to="/products" className="btn-primary">Shop Now</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <StepBar step={step} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 text-center">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Left Panel ── */}
        <div className="lg:col-span-2">

          {/* STEP 0 — Cart Items */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-700 mb-4">🛒 Cart ({count} items)</h2>
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
                    <span className="text-xs bg-eco-bg text-eco-dark px-2 py-0.5 rounded-full">🌱 {item.sustainabilityScore}% eco</span>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(item._id, item.qty - 1)} className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-primary flex items-center justify-center font-bold">−</button>
                        <span className="w-8 text-center font-semibold">{item.qty}</span>
                        <button onClick={() => updateQty(item._id, item.qty + 1)} className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-primary flex items-center justify-center font-bold">+</button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-primary text-lg">${(item.price * item.qty).toFixed(2)}</span>
                        <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 1 — Shipping Address */}
          {step === 1 && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-700 mb-6">📍 Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
                  <input className="input" placeholder="John Doe" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Street Address *</label>
                  <input className="input" placeholder="123 Green Street, Apt 4B" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">City *</label>
                    <input className="input" placeholder="Chennai" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">State *</label>
                    <input className="input" placeholder="Tamil Nadu" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">ZIP Code *</label>
                    <input className="input" placeholder="600001" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Country</label>
                    <select className="input" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })}>
                      {['India', 'USA', 'UK', 'Canada', 'Australia', 'Germany', 'France'].map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Payment */}
          {step === 2 && (
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-700 mb-6">💳 Payment</h2>

              {/* Payment Method Toggle */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setPayMethod('card')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${payMethod === 'card' ? 'border-primary bg-eco-bg' : 'border-gray-200'}`}
                >
                  <div className="text-2xl mb-1">💳</div>
                  <div className="font-semibold text-sm">Credit / Debit Card</div>
                  <div className="text-xs text-gray-400">Visa, Mastercard, RuPay</div>
                </button>
                <button
                  onClick={() => setPayMethod('cod')}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${payMethod === 'cod' ? 'border-primary bg-eco-bg' : 'border-gray-200'}`}
                >
                  <div className="text-2xl mb-1">💵</div>
                  <div className="font-semibold text-sm">Cash on Delivery</div>
                  <div className="text-xs text-gray-400">Pay when delivered</div>
                </button>
              </div>

              {/* Card Form */}
              {payMethod === 'card' && (
                <div className="space-y-4">
                  {/* Card Preview */}
                  <div className="bg-gradient-to-br from-eco-dark to-green-600 rounded-2xl p-5 text-white mb-4">
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-lg font-bold">🌿 EcoThix Pay</span>
                      <span className="text-white/70 text-sm">VISA</span>
                    </div>
                    <div className="text-xl font-mono tracking-widest mb-4">
                      {card.number || '•••• •••• •••• ••••'}
                    </div>
                    <div className="flex justify-between text-sm">
                      <div>
                        <div className="text-white/60 text-xs">CARD HOLDER</div>
                        <div>{card.name || 'YOUR NAME'}</div>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs">EXPIRES</div>
                        <div>{card.expiry || 'MM/YY'}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Card Number *</label>
                    <input
                      className="input font-mono"
                      placeholder="1234 5678 9012 3456"
                      value={card.number}
                      maxLength={19}
                      onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Cardholder Name *</label>
                    <input
                      className="input"
                      placeholder="John Doe"
                      value={card.name}
                      onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Expiry Date *</label>
                      <input
                        className="input"
                        placeholder="MM/YY"
                        value={card.expiry}
                        maxLength={5}
                        onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">CVV *</label>
                      <input
                        className="input"
                        placeholder="•••"
                        type="password"
                        maxLength={4}
                        value={card.cvv}
                        onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">🔒 Your payment is secured with 256-bit SSL encryption</p>
                </div>
              )}

              {payMethod === 'cod' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-700">
                  <p className="font-semibold mb-1">💵 Cash on Delivery Selected</p>
                  <p>Pay <strong>${total.toFixed(2)}</strong> in cash when your order arrives. No advance payment needed.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right Panel — Order Summary ── */}
        <div>
          <div className="card p-6 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">Order Summary</h3>

            {/* Mini cart items */}
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate flex-1">{item.name} ×{item.qty}</span>
                  <span className="font-medium ml-2">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t pt-3 mb-4">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>${total.toFixed(2)}</span></div>
              <div className="flex justify-between text-green-600"><span>🌍 Carbon Offset</span><span>Free</span></div>
              <div className="flex justify-between text-green-600"><span>🚚 Eco Shipping</span><span>Free</span></div>
              <hr />
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary">${total.toFixed(2)}</span></div>
            </div>

            {/* Eco Impact Preview */}
            <div className="bg-eco-bg rounded-xl p-3 mb-4 space-y-1 text-xs">
              <p className="font-semibold text-eco-dark mb-1">🌿 Your Impact</p>
              <p className="text-green-700">🌳 {treesPlanted} trees will be planted</p>
              <p className="text-blue-700">☁️ {carbonSaved} kg CO₂ offset</p>
              <p className="text-primary">🌱 +{creditsEarned} eco-credits</p>
            </div>

            {/* Navigation Buttons */}
            {step === 0 && (
              <button
                onClick={() => { if (!user) return navigate('/login'); setError(''); setStep(1); }}
                className="btn-primary w-full py-3"
              >
                Proceed to Shipping →
              </button>
            )}
            {step === 1 && (
              <div className="space-y-2">
                <button onClick={() => { setError(''); if (validateAddress()) setStep(2); }} className="btn-primary w-full py-3">
                  Continue to Payment →
                </button>
                <button onClick={() => setStep(0)} className="btn-outline w-full py-2 text-sm">← Back to Cart</button>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-2">
                <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary w-full py-3">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Processing Payment...
                    </span>
                  ) : `🔐 Pay $${total.toFixed(2)}`}
                </button>
                <button onClick={() => setStep(1)} className="btn-outline w-full py-2 text-sm">← Back to Shipping</button>
              </div>
            )}

            {!user && step === 0 && <p className="text-xs text-center text-gray-400 mt-2">You'll be asked to login</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
