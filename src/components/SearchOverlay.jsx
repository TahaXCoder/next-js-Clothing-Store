'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Search, Mic, MicOff, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './SearchOverlay.css';

const searchCategories = ['All types', 'New In', 'Men', 'Women', 'Sale', 'Outerwear', 'Hoodies', 'T-Shirts'];

export default function SearchOverlay() {
  const { isSearchOpen, setIsSearchOpen } = useCart();
  const [query, setQuery] = useState('');
  const [catOpen, setCatOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState('All types');
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (isSearchOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isSearchOpen]);

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice search is not supported in this browser. Try typing your search query!');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      if (transcript.trim()) {
        setIsSearchOpen(false);
        router.push(`/shop?search=${encodeURIComponent(transcript)}`);
      }
    };

    recognition.start();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearchOpen(false);
      router.push(`/shop?search=${encodeURIComponent(query)}`);
      setQuery('');
    }
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          <motion.div
            className="overlay-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
            style={{ zIndex: 250 }}
          />
          <motion.div
            className="search-overlay"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <button
              className="search-close"
              onClick={() => setIsSearchOpen(false)}
              aria-label="Close search"
            >
              <X size={22} />
            </button>

            <form className="search-bar" onSubmit={handleSearch}>
              {/* Category selector */}
              <div className="search-cat-wrapper">
                <button
                  type="button"
                  className="search-cat-btn"
                  onClick={() => setCatOpen(v => !v)}
                >
                  <span>{selectedCat}</span>
                  <ChevronDown size={14} />
                </button>
                <AnimatePresence>
                  {catOpen && (
                    <motion.ul
                      className="search-cat-dropdown"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                    >
                      {searchCategories.map(cat => (
                        <li key={cat}>
                          <button
                            type="button"
                            className={`search-cat-option ${selectedCat === cat ? 'active' : ''}`}
                            onClick={() => { setSelectedCat(cat); setCatOpen(false); }}
                          >
                            {cat}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              <div className="search-divider-v" />

              {/* Text input */}
              <input
                ref={inputRef}
                className="search-input"
                type="text"
                placeholder={isListening ? "Listening... Speak now..." : "Search for styles, collections..."}
                value={query}
                onChange={e => setQuery(e.target.value)}
              />

              {/* Voice Speech Search Button */}
              <button 
                type="button" 
                className={`search-icon-btn ${isListening ? 'listening' : ''}`} 
                onClick={handleVoiceSearch}
                aria-label="Voice search"
                title="Click to speak"
              >
                {isListening ? <MicOff size={18} color="#C86A4B" /> : <Mic size={18} />}
              </button>

              {/* Search submit */}
              <button type="submit" className="search-icon-btn search-submit" aria-label="Search">
                <Search size={18} />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
