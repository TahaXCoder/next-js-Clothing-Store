'use client';
import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { normalizeProducts } from '../lib/normalize';
import { products as fallbackProducts } from '../data/products';
import ProductCard from './ProductCard';
import './RecentlyViewed.css';

export default function RecentlyViewed({ currentProductId }) {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    try {
      const savedIds = JSON.parse(localStorage.getItem('zipup_recently_viewed') || '[]');
      const filteredIds = savedIds
        .filter(id => String(id) !== String(currentProductId))
        .slice(0, 4);

      if (filteredIds.length === 0) {
        setRecentProducts([]);
        return;
      }

      // Fast initial display from fallback data if available
      const initial = filteredIds
        .map(id => fallbackProducts.find(p => String(p.id) === String(id)))
        .filter(Boolean);
      if (initial.length > 0) {
        setRecentProducts(normalizeProducts(initial));
      }

      // Fetch from API
      let isMounted = true;
      api(`/products?ids=${filteredIds.join(',')}`)
        .then((data) => {
          if (isMounted && data.products && data.products.length > 0) {
            setRecentProducts(normalizeProducts(data.products));
          }
        })
        .catch((e) => {
          console.error('Error fetching recently viewed products from API:', e);
        });

      return () => {
        isMounted = false;
      };
    } catch (e) {
      console.error(e);
    }
  }, [currentProductId]);

  if (recentProducts.length === 0) return null;

  return (
    <section className="recently-viewed-section">
      <div className="container">
        <h2 className="section-title">Recently Viewed</h2>
        <div className="recently-viewed-grid">
          {recentProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
