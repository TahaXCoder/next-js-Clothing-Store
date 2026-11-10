'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Star } from 'lucide-react';
import { products } from '../data/products';
import { normalizeProducts } from '../lib/normalize';
import { api } from '../api';
import ProductCard from '../components/ProductCard';
import TileSlider from '../components/TileSlider';
import SaleAudioPlayer from '../components/SaleAudioPlayer';
import { menSlides, saleSlides } from '../data/heroSlides';
import './HomePage.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  }),
};

export default function HomePage() {
  const [productList, setProductList] = useState(() => normalizeProducts(products));
  const saleBannerRef = useRef(null);

  // Always start at the very top of the page on refresh
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);

      const handleBeforeUnload = () => {
        window.scrollTo(0, 0);
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    api('/products')
      .then((data) => {
        if (isMounted && data.products) {
          setProductList(normalizeProducts(data.products));
        }
      })
      .catch((err) => console.error('Failed to load products for homepage:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  const featured = productList.slice(0, 4);
  const newIn = productList.filter(p => p.isNew).slice(0, 2);
  const sale = productList.filter(p => p.isSale).slice(0, 1);

  return (
    <main className="page-wrapper">

      {/* ── HERO BANNER (split layout) ── */}
      <section className="hero">
        <div className="hero-grid">

          {/* Large promo tile */}
          <motion.div
            className="hero-promo"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <p className="hero-eyebrow">New Season Drop</p>
            <h1 className="hero-headline">
              Urban<br />
              <span className="hero-headline-gold">Utility</span><br />
              Redefined.
            </h1>
            <p className="hero-sub">Crafted for the streets of Pakistan. Built to last.</p>
            <div className="hero-actions">
              <Link href="/shop" className="btn btn-primary">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link href="/shop?category=New In" className="btn btn-ghost">
                New In
              </Link>
            </div>
          </motion.div>

          {/* Two portrait image tiles – auto-sliding carousels */}
          <div className="hero-tiles">
            <motion.div
              className="hero-tile hero-tile-1"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <TileSlider
                slides={menSlides}
                interval={3500}
                startDelay={0}
                fallbackClass="hero-tile-1"
              />
            </motion.div>
            <motion.div
              className="hero-tile hero-tile-2"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.7 }}
            >
              <TileSlider
                slides={saleSlides}
                interval={3500}
                startDelay={1000}
                fallbackClass="hero-tile-2"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ANNOUNCEMENT BAR ── */}
      <div className="announcement-bar">
        <span>🇵🇰 Free delivery on orders above Rs. 5,000 · COD available nationwide</span>
      </div>

      {/* ── FEATURED COLLECTION ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-label">Our Picks</p>
              <h2 className="section-title">Featured Collection</h2>
            </div>
            <Link href="/shop" className="btn btn-outline">
              View All <ArrowRight size={15} />
            </Link>
          </div>
          <div className="products-grid-4">
            {featured.map((p, i) => (
              <motion.div
                key={p.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRAND STORY ── */}
      <section className="brand-story">
        <div className="container">
          <div className="brand-story-grid">
            <div className="brand-story-visual">
              <div className="brand-story-img" />
              <div className="brand-story-accent-block">
                <p className="brand-story-accent-num">8+</p>
                <p className="brand-story-accent-label">Years in Urban Fashion</p>
              </div>
            </div>
            <motion.div
              className="brand-story-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <p className="section-label">Our Story</p>
              <h2 className="section-title">Born in the<br /><span style={{ color: 'var(--zipup-primary)' }}>Streets of Pakistan</span></h2>
              <p className="brand-story-text">
                Zipup started with a simple idea: Pakistani streets deserve world-class streetwear.
                We design every piece for the urban Pakistani — functional, bold, and built to outlast the seasons.
              </p>
              <p className="brand-story-text">
                From Lahore's Liberty Market to Karachi's Clifton — Zipup is worn by those who move with purpose.
              </p>
              <Link href="/shop" className="btn btn-primary" style={{ marginTop: 'var(--sp-6)' }}>
                Explore the Range <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BRAND VALUES ── */}
      <section className="section">
        <div className="container">
          <div className="values-grid">
            {[
              { icon: <Zap size={28} />, title: 'Urban Performance', desc: 'Every stitch designed to move with you — from commute to weekend.' },
              { icon: <Shield size={28} />, title: 'Built to Last', desc: 'Premium fabrics and meticulous craftsmanship. Quality over quantity.' },
              { icon: <Star size={28} />, title: 'Uniquely Zipup', desc: 'Distinct silhouettes that set you apart — no fast fashion, no compromise.' },
            ].map((v, i) => (
              <motion.div
                key={i}
                className="value-card"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="value-icon">{v.icon}</div>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-desc">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SALE BANNER ── */}
      <section className="sale-banner">
        <div className="container">
          <motion.div
            className="sale-banner-inner"
            ref={saleBannerRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <SaleAudioPlayer targetRef={saleBannerRef} />
            <div>
              <p className="section-label">Limited Time</p>
              <h2 className="sale-banner-title">
                Flat <span>30%</span> Off<br />Winter is Coming Sale
              </h2>
              <p className="sale-banner-sub">In stores & online · While stock lasts</p>
            </div>
            <Link href="/shop?category=Sale" className="btn btn-primary" style={{ fontSize: '1rem', padding: '16px 40px' }}>
              Shop the Sale <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
