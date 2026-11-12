'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingBag, Check, Star, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import BaadMayWidget from './BaadMayWidget';
import './QuickViewModal.css';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colorNames[0] || 'Black');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <motion.div 
        className="quick-view-modal"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="quick-view-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="quick-view-grid">
          {/* Visual Side */}
          <div className="quick-view-media">
            <div 
              className="quick-view-img"
              style={{ background: `linear-gradient(135deg, ${product.colors[0]} 0%, #1F1A17 100%)` }}
            >
              <span className="quick-view-badge">{product.badge || 'Zipup Quick View'}</span>
              <span className="quick-view-initials">{product.title.split(' ').slice(0, 2).map(w=>w[0]).join('')}</span>
            </div>
          </div>

          {/* Details Side */}
          <div className="quick-view-details">
            <span className="quick-view-cat">{product.category}</span>
            <h2 className="quick-view-title">{product.title}</h2>

            <div className="quick-view-price-row">
              <span className="quick-view-price">PKR {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="quick-view-original">PKR {product.originalPrice.toLocaleString()}</span>
              )}
            </div>

            <p className="quick-view-desc">{product.description}</p>

            {/* BaadMay BNPL widget */}
            <BaadMayWidget price={product.price} />

            {/* Color swatches */}
            <div className="quick-view-group">
              <label>Color: <strong>{selectedColor}</strong></label>
              <div className="quick-view-swatches">
                {product.colorNames.map((cName, idx) => (
                  <button
                    key={cName}
                    className={`quick-swatch ${selectedColor === cName ? 'active' : ''}`}
                    onClick={() => setSelectedColor(cName)}
                  >
                    <span style={{ backgroundColor: product.colors[idx] || '#111' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="quick-view-group">
              <label>Size: <strong>{selectedSize}</strong></label>
              <div className="quick-view-sizes">
                {product.sizes.map(s => (
                  <button
                    key={s}
                    className={`quick-size-btn ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add button */}
            <div className="quick-view-actions">
              <div className="quick-qty">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}>+</button>
              </div>

              <button 
                className={`btn btn-primary quick-add-btn ${added ? 'added' : ''}`}
                onClick={handleAdd}
              >
                {added ? (
                  <>
                    <Check size={18} /> Added to Bag!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Add to Bag — PKR {(product.price * quantity).toLocaleString()}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
