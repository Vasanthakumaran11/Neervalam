import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TokenStorage, UserStorage, getMyProfile } from '../services/apiService';

// ─── Context Definition ───────────────────────────────────────────────────────
const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the whole app.
 * Exposes: user, token, role, isAuthenticated, login(), logout(), isLoading
 */
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true while we check localStorage

  // On mount: restore session from localStorage
  useEffect(() => {
    const savedToken = TokenStorage.get();
    const savedUser  = UserStorage.get();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  /**
   * Called after successful OTP verification.
   * `authData` = { access_token, user: { id, phone, role, ... } }
   */
  const login = useCallback((authData) => {
    setToken(authData.access_token);
    setUser(authData.user);
    TokenStorage.set(authData.access_token);
    UserStorage.set(authData.user);
  }, []);

  /** Clear all auth state and storage. */
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    TokenStorage.clear();
    UserStorage.clear();
  }, []);

  const isAuthenticated = Boolean(token && user);
  const role = user?.role || null; // 'farmer' | 'government_official'

  return (
    <AuthContext.Provider value={{ user, token, role, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to consume auth context anywhere in the app. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
