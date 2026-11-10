'use client';

/**
 * TileSlider – auto-advancing cross-fade carousel for the hero tiles.
 *
 * Props
 * ─────
 * slides       {Array}  – slide objects from heroSlides.js
 * interval     {number} – ms between auto-advances (default 5000)
 * startDelay   {number} – ms before the first auto-advance fires (default 0)
 * fallbackClass {string} – CSS class applied when image fails / is missing
 *                          (should provide the tile's gradient background)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import './TileSlider.css';

export default function TileSlider({
  slides = [],
  interval = 5000,
  startDelay = 0,
  fallbackClass = '',
}) {
  const [[current, direction], setSlideState] = useState([0, 1]);
  const [paused, setPaused] = useState(false);
  // Track which slides had an image-load error
  const [errored, setErrored] = useState(() => new Set());
  const prefersReduced = useReducedMotion();

  const timerRef = useRef(null);
  const startDelayRef = useRef(null);

  const total = slides.length;

  // ── Advance helpers ────────────────────────────────────────────────────────
  const goTo = useCallback((index) => {
    setSlideState(([prev]) => [index, index > prev ? 1 : -1]);
  }, []);

  const advance = useCallback(() => {
    setSlideState(([prev]) => [(prev + 1) % total, 1]);
  }, [total]);

  const goPrev = useCallback(() => {
    setSlideState(([prev]) => [(prev - 1 + total) % total, -1]);
  }, [total]);

  // ── Auto-advance timer ─────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    if (prefersReduced) return; // no auto-advance for reduced-motion users
    timerRef.current = setInterval(advance, interval);
  }, [advance, interval, prefersReduced]);

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (paused || prefersReduced) {
      stopTimer();
      return;
    }
    // Apply startDelay only once on mount
    startDelayRef.current = setTimeout(() => {
      startTimer();
    }, startDelay);

    return () => {
      clearTimeout(startDelayRef.current);
      stopTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, prefersReduced]);

  // Restart timer whenever current slide is set via dot click
  const handleDotClick = (index) => {
    if (index === current) return;
    goTo(index);
    stopTimer();
    if (!prefersReduced) {
      timerRef.current = setInterval(advance, interval);
    }
  };

  // ── Touch / drag swipe ─────────────────────────────────────────────────────
  const dragThreshold = 50; // px

  const handleDragEnd = (_e, info) => {
    if (info.offset.x < -dragThreshold) {
      advance();
    } else if (info.offset.x > dragThreshold) {
      goPrev();
    }
    // Restart timer after drag
    stopTimer();
    if (!prefersReduced && !paused) startTimer();
  };

  // ── Slide variants (Physical horizontal slide) ─────────────────────────────
  const slideVariants = {
    enter: (dir) => ({
      x: prefersReduced ? 0 : (dir > 0 ? '100%' : '-100%'),
      opacity: prefersReduced ? 1 : 0.85,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: prefersReduced
        ? { duration: 0 }
        : {
            x: { duration: 0.75, ease: [0.25, 1, 0.5, 1] },
            opacity: { duration: 0.4 },
          },
    },
    exit: (dir) => ({
      x: prefersReduced ? 0 : (dir > 0 ? '-100%' : '100%'),
      opacity: prefersReduced ? 0 : 0.85,
      transition: prefersReduced
        ? { duration: 0 }
        : {
            x: { duration: 0.75, ease: [0.25, 1, 0.5, 1] },
            opacity: { duration: 0.4 },
          },
    }),
  };

  const kenBurnsVariants = {
    start: { scale: prefersReduced ? 1 : 1.06 },
    end:   { scale: 1 },
  };

  if (!slides || total === 0) return null;

  const slide = slides[current];
  const imageErrored = errored.has(current);

  return (
    <div
      className={`tile-slider${imageErrored ? ` ${fallbackClass}` : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Slides with custom direction */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          className="tile-slider__slide"
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          drag={prefersReduced ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          {/* Ken Burns zoom wrapper */}
          <motion.div
            className="tile-slider__img-wrap"
            variants={kenBurnsVariants}
            initial="start"
            animate="end"
            transition={{
              duration: prefersReduced ? 0 : interval / 1000,
              ease: 'easeOut',
            }}
          >
            {!imageErrored && (
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                priority={current === 0}
                loading={current === 0 ? 'eager' : 'lazy'}
                onError={() =>
                  setErrored((prev) => {
                    const next = new Set(prev);
                    next.add(current);
                    return next;
                  })
                }
              />
            )}
          </motion.div>

          {/* Bottom gradient for text legibility */}
          <div className="tile-slider__gradient" aria-hidden="true" />

          {/* Overlay: label chip + title + link */}
          <Link href={slide.href} className="tile-slider__overlay" tabIndex={-1} aria-hidden="true">
            <span className="tile-slider__badge">{slide.label}</span>
            <p className="tile-slider__title">{slide.title}</p>
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Accessible link covering the whole tile */}
      <Link
        href={slide.href}
        className="tile-slider__full-link"
        aria-label={`${slide.title} – ${slide.label}`}
      />

      {/* Dot indicators */}
      {total > 1 && (
        <div className="tile-slider__dots" role="group" aria-label="Slide indicators">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`tile-slider__dot${i === current ? ' tile-slider__dot--active' : ''}`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current ? 'true' : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleDotClick(i);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

