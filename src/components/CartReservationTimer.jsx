'use client';
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import './CartReservationTimer.css';

const START = 899; // 14 min 59 sec

export default function CartReservationTimer() {
  const [seconds, setSeconds] = useState(null);   // null = not loaded yet (server and first render)

  // Browser only: read the saved time once
  useEffect(() => {
    const saved = sessionStorage.getItem('zipup_timer');
    setSeconds(saved !== null ? parseInt(saved, 10) : START);
  }, []);

  // One interval that ticks down while time remains
  useEffect(() => {
    if (seconds === null) return;
    const id = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [seconds === null]);

  // Save after every change
  useEffect(() => {
    if (seconds !== null) sessionStorage.setItem('zipup_timer', String(seconds));
  }, [seconds]);

  if (seconds === null || seconds <= 0) return null;

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <div className="cart-reservation-bar">
      <Clock size={14} className="timer-icon animate-pulse" />
      <span>
        🔥 Items in your bag are reserved for <strong>{formattedTime}</strong> min
      </span>
    </div>
  );
}