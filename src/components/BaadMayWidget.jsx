'use client';
import React, { useState } from 'react';
import { ShieldCheck, Info, X, CheckCircle } from 'lucide-react';
import './BaadMayWidget.css';

export default function BaadMayWidget({ price }) {
  const [showModal, setShowModal] = useState(false);
  const installment = Math.round(price / 3);

  return (
    <>
      <div className="baadmay-widget" onClick={() => setShowModal(true)}>
        <div className="baadmay-badge">
          <span className="baadmay-logo">baadmay</span>
        </div>
        <p className="baadmay-text">
          Pay in 3 installments of <strong>PKR {installment.toLocaleString()}</strong> with 0% interest.
        </p>
        <Info size={14} className="baadmay-info-icon" />
      </div>

      {showModal && (
        <div className="overlay-backdrop" onClick={() => setShowModal(false)}>
          <div className="baadmay-modal" onClick={(e) => e.stopPropagation()}>
            <button className="baadmay-close-btn" onClick={() => setShowModal(false)}>
              <X size={18} />
            </button>
            <div className="baadmay-modal-header">
              <span className="baadmay-logo-large">baadmay</span>
              <h3>Buy Now, Pay Later</h3>
              <p>Split your purchase into 3 easy interest-free monthly installments across Pakistan.</p>
            </div>

            <div className="baadmay-timeline">
              <div className="timeline-item">
                <div className="timeline-dot active">1</div>
                <div>
                  <strong>Pay 1/3 Today</strong>
                  <span>PKR {installment.toLocaleString()} at checkout</span>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot">2</div>
                <div>
                  <strong>Pay 1/3 in 30 Days</strong>
                  <span>PKR {installment.toLocaleString()} next month</span>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot">3</div>
                <div>
                  <strong>Pay 1/3 in 60 Days</strong>
                  <span>PKR {installment.toLocaleString()} final payment</span>
                </div>
              </div>
            </div>

            <div className="baadmay-features">
              <div><CheckCircle size={14} color="#C86A4B" /> Zero Interest or Hidden Fees</div>
              <div><CheckCircle size={14} color="#C86A4B" /> Instant Approval with CNIC & Phone</div>
              <div><CheckCircle size={14} color="#C86A4B" /> Debit / Credit Card Supported</div>
            </div>

            <button className="btn btn-primary btn-full" onClick={() => setShowModal(false)}>
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}
