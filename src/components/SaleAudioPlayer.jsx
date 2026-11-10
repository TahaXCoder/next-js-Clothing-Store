'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import './SaleAudioPlayer.css';

/**
 * SaleAudioPlayer
 *
 * Automatically plays the Winter is Coming Sale audio
 * whenever the user arrives on the sale section (hover, scroll into view, or click).
 * Provides a dedicated Mute / Unmute toggle button.
 */
export default function SaleAudioPlayer({
  src = '/audio/winter-sale.mp3',
  targetRef = null,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const isMutedRef = useRef(false);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Safe play helper
  const tryPlay = useCallback(() => {
    if (!audioRef.current || isMutedRef.current) return;

    audioRef.current.volume = 0.8;
    audioRef.current.muted = false;

    const promise = audioRef.current.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // If browser Autoplay Policy blocks unmuted sound before a user gesture:
          // Register a one-time global click/pointer listener to start audio the very moment they touch/click
          const unlockAndPlay = () => {
            if (!audioRef.current || isMutedRef.current) return;
            audioRef.current
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {});
            window.removeEventListener('pointerdown', unlockAndPlay);
            window.removeEventListener('click', unlockAndPlay);
            window.removeEventListener('keydown', unlockAndPlay);
          };

          window.addEventListener('pointerdown', unlockAndPlay, { once: true });
          window.addEventListener('click', unlockAndPlay, { once: true });
          window.addEventListener('keydown', unlockAndPlay, { once: true });
        });
    }
  }, []);

  const pauseAudio = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  // Toggle Mute / Unmute
  const toggleMute = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;

    if (isMuted) {
      // Unmute
      audioRef.current.muted = false;
      setIsMuted(false);
      isMutedRef.current = false;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      // Mute
      audioRef.current.muted = true;
      setIsMuted(true);
      isMutedRef.current = true;
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // 1. Trigger when scrolling into the sale section
  useEffect(() => {
    const target = targetRef?.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tryPlay();
          } else {
            // Pause when scrolled out of view
            pauseAudio();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetRef, tryPlay, pauseAudio]);

  // 2. Trigger on mouseenter / hover / pointerenter / click on the sale section or hero sale tile
  useEffect(() => {
    const elements = [];
    if (targetRef?.current) elements.push(targetRef.current);

    const extraTriggers = document.querySelectorAll('[data-sale-trigger="true"]');
    extraTriggers.forEach((el) => elements.push(el));

    const handleHover = () => {
      tryPlay();
    };

    const handleClick = (e) => {
      // If clicked on an actual Link or button, let that action happen naturally
      if (e.target.closest('a') || e.target.closest('button')) return;
      tryPlay();
    };

    elements.forEach((el) => {
      el.addEventListener('mouseenter', handleHover);
      el.addEventListener('mousemove', handleHover);
      el.addEventListener('pointerenter', handleHover);
      el.addEventListener('click', handleClick);
    });

    return () => {
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', handleHover);
        el.removeEventListener('mousemove', handleHover);
        el.removeEventListener('pointerenter', handleHover);
        el.removeEventListener('click', handleClick);
      });
    };
  }, [targetRef, tryPlay]);

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
      />

      {/* Mute / Unmute Button */}
      <button
        type="button"
        className={`sale-audio-btn ${isPlaying && !isMuted ? 'sale-audio-btn--active' : ''}`}
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        title={isMuted ? 'Click to Unmute' : 'Click to Mute'}
      >
        <span className="sale-audio-btn__icon">
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </span>
        <span className="sale-audio-btn__label">
          {isMuted ? 'Unmute' : 'Mute'}
        </span>
        {isPlaying && !isMuted && (
          <span className="sale-audio-waves" aria-hidden="true">
            <span className="wave-bar bar-1"></span>
            <span className="wave-bar bar-2"></span>
            <span className="wave-bar bar-3"></span>
          </span>
        )}
      </button>
    </>
  );
}
