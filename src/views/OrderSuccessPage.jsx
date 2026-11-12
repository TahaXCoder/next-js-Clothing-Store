'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, ArrowRight, ShoppingBag } from 'lucide-react';
import './OrderSuccessPage.css';

export default function OrderSuccessPage() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('latest_order');
    if (saved) {
      setOrder(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="order-success-page">
      <div className="container">
        <motion.div 
          className="success-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="success-icon-wrap">
            <CheckCircle size={64} color="#C8A96E" />
          </div>

          <span className="success-tag">Order Confirmed</span>
          <h1 className="success-title">Thank You For Your Order!</h1>
          <p className="success-sub">
            Your order <strong>#{order?.orderId || 'ZIP-849201'}</strong> has been received and is now being prepared for dispatch.
          </p>

          <div className="order-summary-box">
            <div className="summary-info-grid">
              <div className="info-block">
                <span>Customer</span>
                <strong>{order?.customer?.firstName} {order?.customer?.lastName}</strong>
                <p>{order?.customer?.email}</p>
              </div>
              <div className="info-block">
                <span>Shipping Address</span>
                <strong>{order?.customer?.address}</strong>
                <p>{order?.customer?.city}, Pakistan</p>
              </div>
              <div className="info-block">
                <span>Payment Method</span>
                <strong>{order?.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Debit / Credit Card'}</strong>
                <p>Status: Pending Delivery</p>
              </div>
              <div className="info-block">
                <span>Total Paid</span>
                <strong className="gold-text">PKR {order?.total ? order.total.toLocaleString() : '8,490'}</strong>
              </div>
            </div>

            {order?.items && (
              <div className="ordered-items-preview">
                <h4>Items Ordered ({order.items.length})</h4>
                <div className="items-mini-list">
                  {order.items.map(item => (
                    <div key={item.key} className="item-mini">
                      <span>{item.product.title}</span>
                      <span className="qty-size">Size {item.size} x {item.quantity}</span>
                      <span className="price">PKR {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="timeline-tracker">
            <div className="tracker-step active">
              <Package size={20} />
              <span>Order Placed</span>
            </div>
            <div className="tracker-line" />
            <div className="tracker-step">
              <Truck size={20} />
              <span>Dispatched</span>
            </div>
            <div className="tracker-line" />
            <div className="tracker-step">
              <CheckCircle size={20} />
              <span>Delivered</span>
            </div>
          </div>

          <div className="success-actions">
            <Link href="/shop" className="btn btn-primary">
              <ShoppingBag size={18} /> Continue Shopping
            </Link>
            <Link href="/" className="btn btn-secondary">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
