import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-eco-dark">
          <span className="text-primary text-3xl">🌿</span>
          ECO<span className="text-primary">THIX</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-600 hover:text-primary font-medium transition-colors">Home</Link>
          <Link to="/products" className="text-gray-600 hover:text-primary font-medium transition-colors">Shop</Link>
          <Link to="/suppliers" className="text-gray-600 hover:text-primary font-medium transition-colors">Suppliers</Link>
          {user && <Link to="/dashboard" className="text-gray-600 hover:text-primary font-medium transition-colors">Dashboard</Link>}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden md:flex items-center gap-2 bg-primary-light text-eco-dark px-3 py-1.5 rounded-full text-sm font-semibold">
              🌱 {user.ecoCredits || 100} Credits
            </div>
          )}

          <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <span className="text-2xl">🛒</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-eco-bg px-3 py-2 rounded-full hover:bg-primary-light transition-colors"
              >
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">{user.name}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-eco-bg" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-eco-bg" onClick={() => setMenuOpen(false)}>My Orders</Link>
                  <hr className="my-1" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm">Login</Link>
          )}

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-600"></div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-3">
          <Link to="/" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link to="/suppliers" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Suppliers</Link>
          {user && <Link to="/dashboard" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
          {!user && <Link to="/login" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>Login</Link>}
        </div>
      )}
    </nav>
  );
}
