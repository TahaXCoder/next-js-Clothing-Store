'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);       // starts empty on the server too
  const [cartLoaded, setCartLoaded] = useState(false);  // true once the saved cart is read
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Browser only: load the saved cart once after the page mounts
  useEffect(() => {
    try {
      const saved = localStorage.getItem('zipup_cart');
      if (saved) setCartItems(JSON.parse(saved));
    } catch { /* ignore a corrupted saved cart */ }
    setCartLoaded(true);
  }, []);

  // Save on every change, but only after loading, so the empty start can't erase the saved cart
  useEffect(() => {
    if (cartLoaded) localStorage.setItem('zipup_cart', JSON.stringify(cartItems));
  }, [cartItems, cartLoaded]);

  const addToCart = (product, size, color, quantity = 1) => {
    const pid = product._id || product.id;                   // MongoDB uses _id
    const unitPrice = product.finalPrice ?? product.price;   // sale price when there is one
    setCartItems((prev) => {
      const key = `${pid}-${size}-${color}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { key, product, size, color, quantity, price: unitPrice }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (key) => {
    setCartItems((prev) => prev.filter((i) => i.key !== key));
  };

  const updateQuantity = (key, qty) => {
    if (qty <= 0) return removeFromCart(key);
    setCartItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity: qty } : i)));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
        cartCount, cartTotal,
        isCartOpen, setIsCartOpen,
        isMenuOpen, setIsMenuOpen,
        isSearchOpen, setIsSearchOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};