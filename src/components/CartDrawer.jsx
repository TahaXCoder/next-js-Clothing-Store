'use client';
import { useAuth } from '../context/AuthContext';
import React from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartReservationTimer from './CartReservationTimer';
import './CartDrawer.css';

const formatPKR = (n) => `Rs. ${n.toLocaleString('en-PK')}`;

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { user } = useAuth();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            className="overlay-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            style={{ zIndex: 290 }}
          />
          <motion.aside
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Header */}
            <div className="cart-drawer-header">
              <h2 className="cart-drawer-title">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="cart-drawer-close" aria-label="Close cart">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <ShoppingBag size={48} strokeWidth={1} />
                <p className="cart-empty-title">Your cart is empty</p>
                <p className="cart-empty-sub">Not sure where to start?</p>
                <div className="cart-empty-links">
                  {['New In', 'Men', 'Women', 'Sale'].map(cat => (
                    <Link
                      key={cat}
                      href="/shop"
                      className="cart-empty-cat"
                      onClick={() => setIsCartOpen(false)}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/shop"
                  className="btn btn-primary btn-full"
                  style={{ marginTop: 'var(--sp-6)' }}
                  onClick={() => setIsCartOpen(false)}
                >
                  Continue Shopping
                </Link>
                {!user && (
                  <p className="cart-login-prompt">
                    Have an account?{' '}
                    <Link href="/login" onClick={() => setIsCartOpen(false)}>Log in</Link>
                    {' '}to check out faster.
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="cart-items-list">
                  {/* Reservation timer bar */}
                  <CartReservationTimer />

                  {cartItems.map(item => (
                    <div key={item.key} className="cart-item">
                      {/* Product color swatch as image placeholder */}
                      <div
                        className="cart-item-img"
                        style={{ background: item.color }}
                      >
                        <span>{item.product.title.slice(0, 2)}</span>
                      </div>
                      <div className="cart-item-info">
                        <p className="cart-item-name">{item.product.title}</p>
                        <p className="cart-item-meta">Size: {item.size} · {item.color}</p>
                        <p className="cart-item-price">{formatPKR(item.price)}</p>
                        <div className="cart-item-controls">
                          <button onClick={() => updateQuantity(item.key, item.quantity - 1)}>
                            <Minus size={14} />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.key, item.quantity + 1)}>
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <button className="cart-item-remove" onClick={() => removeFromCart(item.key)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="cart-drawer-footer">
                  <div className="cart-summary-row">
                    <span>Subtotal</span>
                    <span>{formatPKR(cartTotal)}</span>
                  </div>
                  <div className="cart-summary-row">
                    <span>Shipping</span>
                    <span className="text-muted">Calculated at checkout</span>
                  </div>
                  <div className="cart-summary-row total">
                    <span>Total</span>
                    <span>{formatPKR(cartTotal)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    className="btn btn-primary btn-full"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    href="/cart"
                    className="btn btn-ghost btn-full"
                    style={{ marginTop: 'var(--sp-2)' }}
                    onClick={() => setIsCartOpen(false)}
                  >
                    View Full Cart
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
