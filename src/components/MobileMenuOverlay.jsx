'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './MobileMenuOverlay.css';

const menuCategories = [
  { label: 'New In', links: ['New Arrivals', 'Best Sellers', 'Limited Edition'] },
  { label: 'Men',    links: ['Jackets & Outerwear', 'Hoodies & Sweatshirts', 'T-Shirts', 'Trousers & Joggers', 'Shirts'] },
  { label: 'Women',  links: ['Outerwear', 'Sweaters & Tops', 'Bottoms', 'Activewear'] },
  { label: 'Sale',   links: ['Up to 30% Off', 'Clearance'] },
];

export default function MobileMenuOverlay() {
  const { isMenuOpen, setIsMenuOpen } = useCart();
  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (label) => {
    setOpenCategory(prev => prev === label ? null : label);
  };

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          <motion.div
            className="overlay-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            style={{ zIndex: 150 }}
          />
          <motion.div
            className="mobile-menu"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <nav className="mobile-menu-nav">
              {menuCategories.map((cat) => (
                <div key={cat.label} className="mobile-menu-category">
                  <button
                    className="mobile-menu-cat-btn"
                    onClick={() => toggleCategory(cat.label)}
                  >
                    <span>{cat.label}</span>
                    <motion.span
                      animate={{ rotate: openCategory === cat.label ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {openCategory === cat.label && (
                      <motion.ul
                        className="mobile-menu-links"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {cat.links.map(link => (
                          <li key={link}>
                            <Link
                              href="/shop"
                              className="mobile-menu-link"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {link}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            <div className="mobile-menu-footer">
              <Link href="/login"    onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link href="/register" onClick={() => setIsMenuOpen(false)}>Create Account</Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
