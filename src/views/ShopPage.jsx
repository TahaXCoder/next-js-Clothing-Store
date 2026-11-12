'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { categories } from '../data/products';
import { normalizeProducts } from '../lib/normalize';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import './ShopPage.css';

const sortOptions = [
  { value: 'default',    label: 'Featured' },
  { value: 'price-low',  label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest',     label: 'New Arrivals' },
];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get('category') || 'All'
  );
  const [sort, setSort] = useState('default');
  const [rawProducts, setRawProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api('/products')
      .then((data) => {
        if (isMounted && data.products) {
          setRawProducts(normalizeProducts(data.products));
        }
      })
      .catch((err) => {
        console.error('Failed to load products from API:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = [...rawProducts];
    const search = searchParams.get('search')?.toLowerCase();
    if (search) {
      list = list.filter(p =>
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      );
    }
    if (activeCategory !== 'All') {
      if (activeCategory === 'New In') list = list.filter(p => p.isNew);
      else if (activeCategory === 'Sale') list = list.filter(p => p.isSale);
      else list = list.filter(p => p.category === activeCategory);
    }
    if (sort === 'price-low')  list.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
    if (sort === 'newest')     list = list.filter(p => p.isNew).concat(list.filter(p => !p.isNew));
    return list;
  }, [rawProducts, activeCategory, sort, searchParams]);

  return (
    <main className="page-wrapper">
      <div className="container">

        {/* Page header */}
        <div className="shop-header">
          <h1 className="section-title">Shop</h1>
          <p className="shop-count">{loading ? 'Loading...' : `${filtered.length} products`}</p>
        </div>

        {/* Filter + Sort bar */}
        <div className="shop-controls">
          <div className="filter-pills">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="sort-wrapper">
            <SlidersHorizontal size={15} />
            <select
              className="sort-select"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              {sortOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="shop-empty">
            <p>Loading products...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="shop-empty">
            <p>No products found. Try a different filter.</p>
          </div>
        ) : (
          <div className="shop-grid">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
