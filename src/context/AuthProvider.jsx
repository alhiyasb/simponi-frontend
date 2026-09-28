import { useState, useEffect, useCallback } from 'react';
import { login as apiLogin, getProfile as apiGetProfile } from '../services/api';
import { roleMap } from '../constants/roles';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const persistAuth = useCallback((userData, tokenData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('access_token', tokenData);
    setUser(userData);
    setToken(tokenData);
    setIsAuthenticated(true);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  const setAuth = useCallback((userData, tokenData) => {
    persistAuth(userData, tokenData);
  }, [persistAuth]);

  const login = useCallback(async (identifier, password) => {
    const data = await apiLogin(identifier, password);
    persistAuth(data.user, data.access_token);
    return data.user;
  }, [persistAuth]);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const initAuth = useCallback(async () => {
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setToken(storedToken);
        setIsAuthenticated(true);

        const freshUser = await apiGetProfile();
        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
      } catch {
        clearAuth();
      }
    }
    setIsLoading(false);
  }, [clearAuth]);

  useEffect(() => {
    let mounted = true;
    const initialize = async () => {
      await initAuth();
      if (mounted) setIsLoading(false);
    };
    initialize();
    return () => { mounted = false; };
  }, [initAuth]);

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setAuth,
    initAuth,
    roleMap,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}