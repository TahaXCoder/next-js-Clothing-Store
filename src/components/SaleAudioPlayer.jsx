'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import './SaleAudioPlayer.css';

/**
 * SaleAudioPlayer
 *
 * Controls ambient audio for the "Winter is Coming" Sale section.
 * - Plays on hover (if browser allows) or immediately on click.
 * - Shows an interactive Mute / Unmute button.
 * - Gentle fade-in and instant mute controls.
 */
export default function SaleAudioPlayer({
  src = '/audio/winter-sale.mp3',
  targetRef = null,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const audioRef = useRef(null);

  // Play audio safely (handling browser autoplay policies)
  const playAudio = useCallback(() => {
    if (!audioRef.current) return;
    setShowButton(true);

    if (audioRef.current.paused) {
      audioRef.current.currentTime = audioRef.current.currentTime || 0;
      const promise = audioRef.current.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Browser blocked hover-autoplay prior to first interaction.
            // Will play upon direct user click.
          });
      }
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
      audioRef.current.muted = false;
      setIsMuted(false);
      if (audioRef.current.paused) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  // Attach hover and click listeners to the parent section and any sale triggers
  useEffect(() => {
    const elements = [];
    if (targetRef?.current) elements.push(targetRef.current);

    const extraTriggers = document.querySelectorAll('[data-sale-trigger="true"]');
    extraTriggers.forEach((el) => elements.push(el));

    const handleMouseEnter = () => {
      setShowButton(true);
      playAudio();
    };

    const handleMouseLeave = () => {
      // Pause when cursor leaves the sale section
      pauseAudio();
    };

    const handleClick = () => {
      setShowButton(true);
      playAudio();
    };

    elements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
      el.addEventListener('click', handleClick);
    });

    return () => {
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
        el.removeEventListener('click', handleClick);
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

      {/* Mute / Unmute Button */}
      <button
        type="button"
        className={`sale-audio-btn ${showButton ? 'sale-audio-btn--visible' : ''} ${isPlaying && !isMuted ? 'sale-audio-btn--active' : ''}`}
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute sale sound' : 'Mute sale sound'}
        title={isMuted ? 'Unmute sound' : 'Mute sound'}
      >
        <span className="sale-audio-btn__icon">
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </span>
        <span className="sale-audio-btn__label">
          {isMuted ? 'Muted' : isPlaying ? 'Sound On' : 'Play Sound'}
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
