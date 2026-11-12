'use client';
import { useAuth } from '../context/AuthContext';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, CreditCard, DollarSign, CheckCircle2, Lock, ArrowLeft, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import BaadMayWidget from '../components/BaadMayWidget';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: 'Karachi',
    postalCode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod', 'card', or 'baadmay'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingFee = cartTotal > 5000 ? 0 : 250;
  const grandTotal = cartTotal + (cartItems.length > 0 ? shippingFee : 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = 'ZIP-' + Math.floor(100000 + Math.random() * 900000);
      const orderData = {
        orderId,
        customer: formData,
        items: cartItems,
        total: grandTotal,
        paymentMethod: paymentMethod === 'baadmay' ? 'BaadMay (Pay in 3 Installments)' : paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Debit / Credit Card',
        date: new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }),
      };

      sessionStorage.setItem('latest_order', JSON.stringify(orderData));
      clearCart();
      setIsSubmitting(false);
      router.push('/order-success');
    }, 1500);
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page empty-checkout">
        <div className="container text-center">
          <h2>No Items to Checkout</h2>
          <p>Your bag is empty. Please add products to your cart before proceeding.</p>
          <Link href="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <Link href="/cart" className="back-link">
            <ArrowLeft size={16} /> Back to Bag
          </Link>
          <h1 className="checkout-title">Express Checkout</h1>
        </div>

        <div className="checkout-grid">
          {/* Form Side */}
          <form className="checkout-form" onSubmit={handleSubmit}>
            {/* Contact Info */}
            <div className="form-section">
              <h2 className="section-heading">1. Contact Information</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    required 
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="e.g. Hamza"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    required 
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="e.g. Khan"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="hamza@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number (for Courier SMS) *</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0300 1234567"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="form-section">
              <h2 className="section-heading">2. Shipping Address (Pakistan)</h2>
              <div className="form-group">
                <label>Street Address *</label>
                <input 
                  type="text" 
                  name="address" 
                  required 
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House / Flat / Plot No, Street, Sector / Block"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <select name="city" value={formData.city} onChange={handleChange}>
                    <option value="Karachi">Karachi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Quetta">Quetta</option>
                    <option value="Sialkot">Sialkot</option>
                    <option value="Gujranwala">Gujranwala</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Postal Code (Optional)</label>
                  <input 
                    type="text" 
                    name="postalCode" 
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="e.g. 75500"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Order Notes / Delivery Instructions</label>
                <textarea 
                  name="notes" 
                  rows="2"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any special instructions for courier rider..."
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="form-section">
              <h2 className="section-heading">3. Select Payment Method</h2>
              
              <div className="payment-options">
                <label className={`payment-card ${paymentMethod === 'cod' ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div className="payment-card-content">
                    <DollarSign size={20} className="payment-icon" />
                    <div>
                      <strong>Cash on Delivery (COD)</strong>
                      <p>Pay cash right at your doorstep upon delivery.</p>
                    </div>
                  </div>
                </label>

                <label className={`payment-card ${paymentMethod === 'baadmay' ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="baadmay"
                    checked={paymentMethod === 'baadmay'}
                    onChange={() => setPaymentMethod('baadmay')}
                  />
                  <div className="payment-card-content">
                    <Zap size={20} color="#C86A4B" className="payment-icon" />
                    <div>
                      <strong>BaadMay — Pay in 3 Installments (0% Interest)</strong>
                      <p>Pay 1/3 (PKR {Math.round(grandTotal / 3).toLocaleString()}) today, remainder in 30 & 60 days.</p>
                    </div>
                  </div>
                </label>

                <label className={`payment-card ${paymentMethod === 'card' ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <div className="payment-card-content">
                    <CreditCard size={20} className="payment-icon" />
                    <div>
                      <strong>Debit / Credit Card (Visa / Mastercard)</strong>
                      <p>Encrypted 256-bit instant online payment gateway.</p>
                    </div>
                  </div>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="card-mock-form">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input type="text" placeholder="4000 1234 5678 9010" maxLength="19" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry (MM/YY)</label>
                      <input type="text" placeholder="12/28" maxLength="5" />
                    </div>
                    <div className="form-group">
                      <label>CVC / CVV</label>
                      <input type="text" placeholder="123" maxLength="4" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary submit-order-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <Lock size={16} /> Place Order — PKR {grandTotal.toLocaleString()}
                </>
              )}
            </button>
          </form>

          {/* Order Summary Side */}
          <div className="checkout-summary">
            <div className="summary-box">
              <h3>Order Overview ({cartItems.length} items)</h3>

              <div className="checkout-item-list">
                {cartItems.map(item => (
                  <div key={item.key} className="checkout-item">
                    <div 
                      className="checkout-item-color"
                      style={{ background: item.product.colors[0] }}
                    />
                    <div className="checkout-item-details">
                      <span className="item-name">{item.product.title}</span>
                      <span className="item-variant">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</span>
                    </div>
                    <span className="item-price">PKR {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="summary-calculations">
                <div className="calc-row">
                  <span>Subtotal</span>
                  <span>PKR {cartTotal.toLocaleString()}</span>
                </div>
                <div className="calc-row">
                  <span>Delivery Charges</span>
                  <span>{shippingFee === 0 ? <strong className="free">FREE</strong> : `PKR ${shippingFee}`}</span>
                </div>
                <div className="calc-row total">
                  <span>Total Amount Payable</span>
                  <span className="highlight-total">PKR {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="trust-features">
                <div className="trust-item">
                  <Truck size={16} color="#C86A4B" />
                  <span>Dispatched within 24 Hours</span>
                </div>
                <div className="trust-item">
                  <ShieldCheck size={16} color="#C86A4B" />
                  <span>7-Day Return & Exchange Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
