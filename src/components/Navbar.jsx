'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, User, ShoppingBag, Menu, X, LogOut } from 'lucide-react';   // ADDED: LogOut
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { cartCount, setIsCartOpen, setIsMenuOpen, setIsSearchOpen, isMenuOpen } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {          // ADDED
    logout();
    router.push('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Left — Menu */}
        <button
          className="navbar-menu-btn"
          onClick={() => setIsMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          <span>{isMenuOpen ? 'Hide menu' : 'Menu'}</span>
        </button>

        {/* Center — Logo */}
        <Link href="/" className="navbar-logo">
          ZIPUP
        </Link>

        {/* Right — Icons */}
        <div className="navbar-icons">
          <button onClick={() => setIsSearchOpen(true)} aria-label="Search">
            <Search size={20} />
          </button>

          <button
            onClick={() => router.push(user ? '/account' : '/login')}
            aria-label={user ? `Account: ${user.name}` : 'Sign in'}
            title={user ? user.name : 'Sign in'}
          >
            <User size={20} />
          </button>

          {user && (                                   // ADDED: only when logged in
            <button onClick={handleLogout} aria-label="Logout" title="Logout">
              <LogOut size={20} />
            </button>
          )}

          <button
            className="navbar-cart-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}