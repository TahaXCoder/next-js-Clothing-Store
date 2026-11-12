'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the logged-in user after a page refresh
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('zipup_token');
      if (savedToken) {
        setToken(savedToken);
        api('/auth/me', { token: savedToken })
          .then((d) => setUser(d.user))
          .catch(() => logout())
          .finally(() => setLoading(false));
        return;
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const save = (d) => {
    localStorage.setItem('zipup_token', d.token);
    setToken(d.token);
    setUser(d.user);
  };
  const login = async (email, password) =>
    save(await api('/auth/login', { method: 'POST', body: { email, password } }));
  const register = async (name, email, password) =>
    save(await api('/auth/register', { method: 'POST', body: { name, email, password } }));
  const logout = () => {
    localStorage.removeItem('zipup_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}