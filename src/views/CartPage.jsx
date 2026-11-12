'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartPage.css';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const shippingFee = cartTotal > 5000 ? 0 : 250;
  const grandTotal = Math.max(0, cartTotal - discount + (cartItems.length > 0 ? shippingFee : 0));

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ZIPUP10') {
      const disc = Math.round(cartTotal * 0.1);
      setDiscount(disc);
      setPromoApplied(true);
      setPromoError('');
    } else if (promoCode.trim().toUpperCase() === 'PAKISTAN500') {
      setDiscount(500);
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try ZIPUP10 for 10% off');
    }
  };

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Shopping Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart-state">
            <ShoppingBag size={64} strokeWidth={1} color="#C8A96E" />
            <h2>Your Bag is Empty</h2>
            <p>Explore our premium Pakistani streetwear collections and find your style statement.</p>
            <Link href="/shop" className="btn btn-primary">
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="cart-grid">
            {/* Cart Items List */}
            <div className="cart-items-column">
              <div className="cart-items-header">
                <span>Product</span>
                <span>Quantity</span>
                <span>Subtotal</span>
              </div>

              {cartItems.map((item) => (
                <motion.div 
                  key={item.key} 
                  className="cart-item-row"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="cart-item-product">
                    <div 
                      className="cart-item-thumb"
                      style={{ background: `linear-gradient(135deg, ${item.product.colors[0]} 0%, #111 100%)` }}
                    >
                      <span>{item.product.category}</span>
                    </div>
                    <div className="cart-item-info">
                      <Link href={`/product/${item.product.slug}`} className="cart-item-title">
                        {item.product.title}
                      </Link>
                      <div className="cart-item-meta">
                        <span>Color: <strong>{item.color}</strong></span>
                        <span>Size: <strong>{item.size}</strong></span>
                      </div>
                      <span className="cart-item-unit-price">PKR {item.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="cart-item-qty">
                    <div className="qty-controls">
                      <button onClick={() => updateQuantity(item.key, item.quantity - 1)}>
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.key, item.quantity + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-subtotal">
                    <span>PKR {(item.price * item.quantity).toLocaleString()}</span>
                    <button 
                      className="remove-item-btn" 
                      onClick={() => removeFromCart(item.key)}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}

              <div className="cart-actions-bar">
                <button className="clear-cart-btn" onClick={clearCart}>
                  Clear Shopping Bag
                </button>
                <Link href="/shop" className="continue-shopping-link">
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="cart-summary-column">
              <div className="summary-card">
                <h3>Order Summary</h3>

                {/* Promo Code Form */}
                <form className="promo-form" onSubmit={handleApplyPromo}>
                  <div className="promo-input-group">
                    <Tag size={16} className="promo-icon" />
                    <input 
                      type="text" 
                      placeholder="Promo code (e.g. ZIPUP10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button type="submit">Apply</button>
                  </div>
                  {promoApplied && <p className="promo-success">✓ Code applied successfully!</p>}
                  {promoError && <p className="promo-error">{promoError}</p>}
                </form>

                <div className="summary-rows">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>PKR {cartTotal.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div className="summary-row discount">
                      <span>Discount</span>
                      <span>- PKR {discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="summary-row">
                    <span>Estimated Shipping</span>
                    <span>{shippingFee === 0 ? <strong className="free-tag">FREE</strong> : `PKR ${shippingFee}`}</span>
                  </div>

                  {shippingFee > 0 && (
                    <p className="free-shipping-hint">Add PKR {(5000 - cartTotal).toLocaleString()} more for FREE nationwide delivery!</p>
                  )}

                  <div className="summary-divider" />

                  <div className="summary-row total-row">
                    <span>Total</span>
                    <div className="total-amount">
                      <span className="amount-pkr">PKR {grandTotal.toLocaleString()}</span>
                      <span className="tax-inclusive">Inclusive of all taxes</span>
                    </div>
                  </div>
                </div>

                <button 
                  className="btn btn-primary checkout-btn" 
                  onClick={() => router.push('/checkout')}
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>

                <div className="secure-badge">
                  <ShieldCheck size={18} color="#C8A96E" />
                  <span>Secure SSL Checkout & Cash on Delivery Available</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
