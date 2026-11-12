'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';       // CHANGED: was useCart
import './AuthPages.css';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();                       // CHANGED: inside the component

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {                   // CHANGED: async, calls the API
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {                          // CHANGED: 6 to 8 (matches backend)
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);            // POST /api/auth/register
      router.push('/shop');
    } catch (err) {
      setError(err.message);                            // e.g. "email already exists"
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join the Zipup club for exclusive drops, early sale access & reward points.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}

            <div className="input-field">
              <label>Full Name</label>
              <div className="input-wrap">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  required
                  placeholder="Hamza Khan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="input-field">
              <label>Email Address</label>
              <div className="input-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  required
                  placeholder="hamza@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-field">
              <label>Password</label>
              <div className="input-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  required
                  placeholder="Min 8 characters"        // CHANGED
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="input-field">
              <label>Confirm Password</label>
              <div className="input-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-terms">
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>I agree to Zipup's <a href="#terms">Terms of Service</a> & <a href="#privacy">Privacy Policy</a></span>
              </label>
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Creating Account...' : <>Register Now <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="auth-footer">
            <span>Already have an account?</span>
            <Link href="/login" className="auth-switch-link">
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}