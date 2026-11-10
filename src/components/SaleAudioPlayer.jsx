'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import './SaleAudioPlayer.css';

/**
 * SaleAudioPlayer
 *
 * Controls audio strictly for the "Winter is Coming" Sale section.
 * - Does NOT play when the user is at the top of the page.
 * - ONLY plays when the user scrolls down and reaches the sale section,
 *   or interacts with the sale section.
 * - Pauses automatically when the user scrolls away from the sale section.
 * - Provides an instant Mute / Unmute toggle button.
 */
export default function SaleAudioPlayer({
  src = '/audio/winter-sale.mp3',
  targetRef = null,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const isMutedRef = useRef(false);
  const isInViewRef = useRef(false);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Safe play helper - ONLY plays if the sale section is currently in view
  const tryPlay = useCallback(() => {
    if (!audioRef.current || isMutedRef.current) return;
    if (!isInViewRef.current) return; // Strict guard: never play if not in sale section!

    audioRef.current.volume = 0.8;
    audioRef.current.muted = false;

    const promise = audioRef.current.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // If browser policy requires a user tap/click first, unlock on next click inside the section
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
      if (isInViewRef.current) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    } else {
      // Mute
      audioRef.current.muted = true;
      setIsMuted(true);
      isMutedRef.current = true;
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // 1. IntersectionObserver: ONLY active when the sale section is actually on the screen
  useEffect(() => {
    const target = targetRef?.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isInViewRef.current = true;
            tryPlay();
          } else {
            isInViewRef.current = false;
            pauseAudio(); // Immediately stop audio when scrolled away!
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [targetRef, tryPlay, pauseAudio]);

  // 2. Hover / Pointer listeners STRICTLY on the sale banner itself
  useEffect(() => {
    const target = targetRef?.current;
    if (!target) return;

    const handleEnter = () => {
      isInViewRef.current = true;
      tryPlay();
    };

    const handleClick = (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      isInViewRef.current = true;
      tryPlay();
    };

    target.addEventListener('mouseenter', handleEnter);
    target.addEventListener('mousemove', handleEnter);
    target.addEventListener('pointerenter', handleEnter);
    target.addEventListener('click', handleClick);

    return () => {
      target.removeEventListener('mouseenter', handleEnter);
      target.removeEventListener('mousemove', handleEnter);
      target.removeEventListener('pointerenter', handleEnter);
      target.removeEventListener('click', handleClick);
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
