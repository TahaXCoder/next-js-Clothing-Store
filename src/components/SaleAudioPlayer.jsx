'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import './SaleAudioPlayer.css';

/**
 * SaleAudioPlayer
 *
 * Automatically plays the Winter is Coming Sale audio
 * whenever the user arrives on the sale section (scroll into view, hover, or click).
 * Provides an instant Mute / Unmute toggle button (only two options).
 */
export default function SaleAudioPlayer({
  src = '/audio/winter-sale.mp3',
  targetRef = null,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const isUnlockedRef = useRef(false);
  const isMutedRef = useRef(false);

  // Keep isMutedRef in sync with state for event callbacks
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Pre-unlock browser media autoplay policy on first user interaction anywhere on the page
  useEffect(() => {
    const unlockAudio = () => {
      if (isUnlockedRef.current || !audioRef.current) return;
      isUnlockedRef.current = true;

      // Quick silent play/pause to satisfy Chrome/Edge autoplay policy
      const currentVol = audioRef.current.volume;
      audioRef.current.volume = 0;
      const p = audioRef.current.play();
      if (p !== undefined) {
        p.then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.volume = currentVol;
        }).catch(() => {
          isUnlockedRef.current = false;
        });
      }

      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('scroll', unlockAudio);
    };

    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    window.addEventListener('scroll', unlockAudio, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('scroll', unlockAudio);
    };
  }, []);

  const playAudio = useCallback(() => {
    if (!audioRef.current) return;
    if (isMutedRef.current) return; // Do not auto-play if user explicitly muted

    audioRef.current.muted = false;
    const promise = audioRef.current.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // If browser requires explicit gesture, will resume on hover/touch
        });
    }
  }, []);

  const pauseAudio = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  // Toggle Mute / Unmute (only two options)
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

  // 1. Automatically play when user scrolls down and arrives at the sale banner
  useEffect(() => {
    const target = targetRef?.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playAudio();
          } else {
            pauseAudio();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetRef, playAudio, pauseAudio]);

  // 2. Automatically play when cursor arrives (hover or click) on the sale section or hero sale tile
  useEffect(() => {
    const elements = [];
    if (targetRef?.current) elements.push(targetRef.current);

    const extraTriggers = document.querySelectorAll('[data-sale-trigger="true"]');
    extraTriggers.forEach((el) => elements.push(el));

    const handleArrive = () => {
      playAudio();
    };

    const handleLeave = () => {
      pauseAudio();
    };

    elements.forEach((el) => {
      el.addEventListener('mouseenter', handleArrive);
      el.addEventListener('mousemove', handleArrive, { once: true });
      el.addEventListener('mouseleave', handleLeave);
      el.addEventListener('click', handleArrive);
    });

    return () => {
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', handleArrive);
        el.removeEventListener('mousemove', handleArrive);
        el.removeEventListener('mouseleave', handleLeave);
        el.removeEventListener('click', handleArrive);
      });
    };
  }, [targetRef, playAudio, pauseAudio]);

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
      />

      {/* Mute / Unmute Button: ONLY MUTE or UNMUTE */}
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
