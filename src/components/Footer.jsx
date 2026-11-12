'use client';
import React from 'react';
import Link from 'next/link';
import { MessageCircle, Mail, Phone, Clock } from 'lucide-react';
import './Footer.css';

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

export default function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">

            {/* Col 1 — Connect */}
            <div className="footer-col">
              <h4 className="footer-col-title">Connect with Zipup</h4>
              <div className="footer-contact-items">
                <div className="footer-contact-item">
                  <Phone size={15} />
                  <span>+92 300 000 0000</span>
                </div>
                <div className="footer-contact-item">
                  <Clock size={15} />
                  <span>Mon – Sat: 10am – 8pm</span>
                </div>
                <div className="footer-contact-item">
                  <Mail size={15} />
                  <span>hello@zipup.pk</span>
                </div>
              </div>
              <div className="footer-socials">
                <a href="#" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" aria-label="TikTok">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.19 8.19 0 004.79 1.52V6.82a4.85 4.85 0 01-1.02-.13z"/>
                  </svg>
                </a>
                <a href="#" aria-label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2 — Support */}
            <div className="footer-col">
              <h4 className="footer-col-title">Support</h4>
              <ul className="footer-links">
                <li><Link href="/order-success">Track Your Order</Link></li>
                <li><Link href="/cart">View Cart</Link></li>
                <li><Link href="/shop">Shipping & Delivery</Link></li>
                <li><Link href="/shop">Exchange Policy</Link></li>
                <li><Link href="/shop">How to Order</Link></li>
              </ul>
            </div>

            {/* Col 3 — Company */}
            <div className="footer-col">
              <h4 className="footer-col-title">Company</h4>
              <ul className="footer-links">
                <li><Link href="/">About Us</Link></li>
                <li><Link href="/shop">Store Locator</Link></li>
                <li><Link href="/login">Account</Link></li>
                <li><Link href="/register">Join Zipup</Link></li>
              </ul>
            </div>

            {/* Col 4 — Newsletter */}
            <div className="footer-col">
              <h4 className="footer-col-title">Stay in the Loop</h4>
              <p className="footer-newsletter-copy">
                New drops, exclusive deals, and Zipup stories — straight to your inbox.
              </p>
              <form className="footer-newsletter-form" onSubmit={e => e.preventDefault()}>
                <input
                  type="email"
                  className="input-field footer-email-input"
                  placeholder="Your email address"
                />
                <button type="submit" className="footer-newsletter-btn" aria-label="Subscribe">
                  →
                </button>
              </form>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-logo">ZIPUP</p>
            <p className="footer-copy">© {new Date().getFullYear()} Zipup. All rights reserved. Made in Pakistan 🇵🇰</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating back-to-top */}
      <button className="fab-top" onClick={scrollToTop} aria-label="Back to top">↑</button>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/923000000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fab-whatsapp"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={24} />
      </a>
    </>
  );
}
