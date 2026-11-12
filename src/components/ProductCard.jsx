'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import QuickViewModal from './QuickViewModal';
import './ProductCard.css';

const formatPKR = (n) => `Rs. ${n.toLocaleString('en-PK')}`;

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [hovered, setHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colorNames[0]);
  };

  const handleOpenQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <>
      <div
        className="product-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link href={`/product/${product.slug}`}>
          {/* Image / Color Swatch */}
          <div className="product-card-img-wrap">
            <div
              className="product-card-img"
              style={{ background: `linear-gradient(135deg, ${product.colors[0]}, ${product.colors[0]}cc)` }}
            >
              <span className="product-card-initials">
                {product.title.split(' ').slice(0, 2).map(w => w[0]).join('')}
              </span>
            </div>

            {/* Badges */}
            <div className="product-card-badges">
              {product.isNew && <span className="badge badge-gold">New</span>}
              {product.isSale && discount && <span className="badge badge-red">-{discount}%</span>}
              {product.badge && !product.isNew && !product.isSale && (
                <span className="badge badge-dark">{product.badge}</span>
              )}
            </div>

            {/* Hover overlay */}
            <div className={`product-card-overlay ${hovered ? 'visible' : ''}`}>
              <button
                type="button"
                className="product-card-quick-add"
                onClick={handleQuickAdd}
                title="Quick Add to Bag"
              >
                <ShoppingBag size={15} />
                Add
              </button>
              <button
                type="button"
                className="product-card-quick-view"
                onClick={handleOpenQuickView}
                title="Quick View Modal"
              >
                <Eye size={15} />
                Quick View
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="product-card-info">
            <p className="product-card-category">{product.category}</p>
            <h3 className="product-card-title">{product.title}</h3>
            <div className="product-card-price-row">
              <span className={`price-current ${product.isSale ? 'price-sale' : ''}`}>
                {formatPKR(product.price)}
              </span>
              {product.originalPrice && (
                <span className="price-original">{formatPKR(product.originalPrice)}</span>
              )}
            </div>
            {/* Color swatches */}
            <div className="product-card-colors">
              {product.colors.map((c, i) => (
                <span key={i} className="color-swatch" style={{ background: c }} title={product.colorNames[i]} />
              ))}
            </div>
          </div>
        </Link>
      </div>

      {showQuickView && (
        <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
}
