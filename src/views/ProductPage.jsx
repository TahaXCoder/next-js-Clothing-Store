'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Shield, RefreshCw, Truck, ChevronRight, Star, Check } from 'lucide-react';
import { getProductBySlug, products } from '../data/products';
import { normalizeProduct, normalizeProducts } from '../lib/normalize';
import { api } from '../api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import BaadMayWidget from '../components/BaadMayWidget';
import RecentlyViewed from '../components/RecentlyViewed';
import './ProductPage.css';

export default function ProductPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const initialProduct = normalizeProduct(getProductBySlug(slug) || products[0]);
  const [product, setProduct] = useState(initialProduct);
  const [relatedProducts, setRelatedProducts] = useState(() => {
    return normalizeProducts(products.filter(item => item.id !== initialProduct?.id).slice(0, 4));
  });

  const [selectedColor, setSelectedColor] = useState(initialProduct?.colorNames?.[0] || 'Black');
  const [selectedSize, setSelectedSize] = useState(initialProduct?.sizes?.[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    api('/products/' + slug)
      .then((data) => {
        if (!isMounted) return;
        if (data.product) {
          const norm = normalizeProduct(data.product);
          setProduct(norm);
          if (norm.colorNames && norm.colorNames.length > 0) setSelectedColor(norm.colorNames[0]);
          if (norm.sizes && norm.sizes.length > 0) setSelectedSize(norm.sizes[0]);
        }
        if (data.related) {
          setRelatedProducts(normalizeProducts(data.related));
        }
      })
      .catch((err) => {
        console.error('Failed to load product from API:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Track recently viewed items in localStorage
  useEffect(() => {
    if (!product?.id) return;
    try {
      const saved = JSON.parse(localStorage.getItem('zipup_recently_viewed') || '[]');
      const filtered = saved.filter(id => id !== product.id);
      const updated = [product.id, ...filtered].slice(0, 6);
      localStorage.setItem('zipup_recently_viewed', JSON.stringify(updated));
    } catch (e) { console.error(e); }
  }, [product]);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <div className="product-page">
      {/* Breadcrumb */}
      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={14} />
          <Link href="/shop">Shop</Link>
          <ChevronRight size={14} />
          <span>{product.title}</span>
        </nav>
      </div>

      {/* Main Product Layout */}
      <section className="container pdp-grid">
        {/* Left: Gallery View */}
        <motion.div 
          className="pdp-gallery"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="pdp-main-image">
            <div 
              className="pdp-image-placeholder"
              style={{
                background: `linear-gradient(135deg, ${product.colors[0]} 0%, #0d0d0d 100%)`
              }}
            >
              <span className="pdp-image-badge">{product.badge || 'Zipup Exclusive'}</span>
              <div className="pdp-image-graphic">
                <span className="pdp-graphic-title">{product.title}</span>
                <span className="pdp-graphic-cat">{product.category} Collection</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Info & Actions */}
        <motion.div 
          className="pdp-details"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="pdp-header">
            <span className="pdp-category-tag">{product.category}</span>
            <h1 className="pdp-title">{product.title}</h1>
            
            <div className="pdp-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#C8A96E" color="#C8A96E" />
                ))}
              </div>
              <span className="rating-text">4.9 (42 reviews)</span>
            </div>

            <div className="pdp-price-row">
              <span className="pdp-price">PKR {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="pdp-original-price">PKR {product.originalPrice.toLocaleString()}</span>
              )}
              {product.isSale && <span className="pdp-save-badge">Save PKR {(product.originalPrice - product.price).toLocaleString()}</span>}
            </div>

            {/* BaadMay Installments Widget */}
            <BaadMayWidget price={product.price} />
          </div>

          <p className="pdp-description">{product.description}</p>

          {/* Color Selector */}
          <div className="pdp-option-group">
            <label className="option-label">
              Color: <strong>{selectedColor}</strong>
            </label>
            <div className="color-swatches">
              {product.colorNames.map((colorName, idx) => (
                <button
                  key={colorName}
                  className={`color-swatch-btn ${selectedColor === colorName ? 'active' : ''}`}
                  onClick={() => setSelectedColor(colorName)}
                  title={colorName}
                >
                  <span 
                    className="swatch-color" 
                    style={{ backgroundColor: product.colors[idx] || '#111' }} 
                  />
                  {selectedColor === colorName && <Check size={12} className="swatch-check" />}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="pdp-option-group">
            <div className="option-label-flex">
              <label className="option-label">Size: <strong>{selectedSize}</strong></label>
              <button className="size-guide-btn">Size Guide</button>
            </div>
            <div className="size-selector">
              {product.sizes.map(size => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="pdp-actions">
            <div className="quantity-picker">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>

            <button className="btn btn-primary add-to-cart-btn" onClick={handleAddToCart}>
              <ShoppingBag size={18} />
              Add to Bag — PKR {(product.price * quantity).toLocaleString()}
            </button>

            <button 
              className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
              onClick={() => setIsWishlisted(!isWishlisted)}
              title="Add to Wishlist"
            >
              <Heart size={20} fill={isWishlisted ? '#C8A96E' : 'none'} color={isWishlisted ? '#C8A96E' : '#A0A0A0'} />
            </button>
          </div>

          {addedToast && (
            <motion.div 
              className="pdp-toast"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Check size={16} color="#C8A96E" /> Added to your bag!
            </motion.div>
          )}

          {/* Guarantees */}
          <div className="pdp-guarantees">
            <div className="guarantee-item">
              <Truck size={18} />
              <div>
                <strong>Fast Nationwide Delivery</strong>
                <p>Express shipping across Pakistan in 2-4 business days.</p>
              </div>
            </div>
            <div className="guarantee-item">
              <RefreshCw size={18} />
              <div>
                <strong>Hassle-Free 7-Day Exchange</strong>
                <p>Easily exchange for a different size or color.</p>
              </div>
            </div>
            <div className="guarantee-item">
              <Shield size={18} />
              <div>
                <strong>100% Authentic Quality</strong>
                <p>Directly crafted and inspected by Zipup Studios.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Tabs Section */}
      <section className="container pdp-tabs-section">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Details & Specs
          </button>
          <button 
            className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
            onClick={() => setActiveTab('shipping')}
          >
            Shipping & Returns
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="tab-pane">
              <h3>Product Specifications</h3>
              <ul>
                <li>Material: 100% Premium Heavyweight Cotton / Tech Fleece Blend</li>
                <li>Fit: Modern Urban Tailored Silhouette</li>
                <li>Care: Machine wash cold inside out, do not bleach, tumble dry low</li>
                <li>Origin: Crafted with precision in Pakistan</li>
              </ul>
            </div>
          )}
          {activeTab === 'shipping' && (
            <div className="tab-pane">
              <h3>Shipping Information</h3>
              <p>We deliver to all major cities in Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, and Multan.</p>
              <p>Cash on Delivery (COD) is available nationwide for all orders.</p>
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      <section className="container related-products-section">
        <h2 className="section-title">You Might Also Like</h2>
        <div className="products-grid">
          {relatedProducts.map(rel => (
            <ProductCard key={rel.id} product={rel} />
          ))}
        </div>
      </section>

      {/* Recently Viewed Products */}
      <RecentlyViewed currentProductId={product.id} />
    </div>
  );
}
