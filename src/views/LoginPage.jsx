'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();          // CHANGED: from AuthContext (real backend)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {         // CHANGED: async, calls the API
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);           // POST /api/auth/login
      router.push('/shop');
    } catch (err) {
      setError(err.message);                  // e.g. "Invalid email or password"
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="auth-page">
        <div className="container">
          <div className="auth-card text-center">
            <UserCheck size={48} color="#C8A96E" style={{ margin: '0 auto 1rem' }} />
            <h2>Welcome Back, {user.name}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              You are signed in as <strong>{user.email}</strong>.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/shop" className="btn btn-primary">Start Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="auth-title">Sign In</h1>
            <p className="auth-subtitle">Access your Zipup account, orders, and saved addresses.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}

            <div className="input-field">
              <label>Email Address</label>
              <div className="input-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="input-field">
              <div className="field-label-flex">
                <label>Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset is coming soon.'); }} className="forgot-link">
                  Forgot Password?
                </a>
              </div>
              <div className="input-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? 'Signing in...' : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="auth-footer">
            <span>Don't have a Zipup account?</span>
            <Link href="/register" className="auth-switch-link">
              Create Account
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}