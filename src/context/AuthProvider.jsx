import { useState, useEffect, useCallback } from 'react';
import { login as apiLogin } from '../services/api';
import { roleMap } from '../constants/roles';
import { AuthContext } from './AuthContext';

const buildProfileFromUser = (userData = {}) => ({
  name: userData.name || userData.full_name || userData.nama_lengkap || 'Pengguna',
  nik: userData.nik || userData.NIK || '',
  email: userData.email || '',
  phone: userData.phone || userData.no_telepon || userData.telepon || '',
  wilayah: userData.wilayah || userData.kabupaten || userData.kota || 'Kabupaten / Kota',
  status: userData.status || 'Aktif',
  photo: userData.photo || '',
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const persistAuth = useCallback((userData, tokenData) => {
    const normalizedUser = userData || {};

    localStorage.setItem('user', JSON.stringify(normalizedUser));
    localStorage.setItem('access_token', tokenData);
    localStorage.setItem(
      'simponi-user-profile',
      JSON.stringify(buildProfileFromUser(normalizedUser))
    );

    setUser(normalizedUser);
    setToken(tokenData);
    setIsAuthenticated(true);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('simponi-user-profile');

    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  const setAuth = useCallback((userData, tokenData) => {
    persistAuth(userData, tokenData);
  }, [persistAuth]);

  const login = useCallback(
    async (identifier, password, role = 'public') => {
      const data = await apiLogin(identifier, password, role);

      persistAuth(data.user, data.access_token);

      localStorage.setItem(
        'simponi-last-login',
        new Date().toISOString()
      );

      return data.user;
    },
    [persistAuth]
  );

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

        // TEMPORARY: Skip /auth/me validation due to backend CORS issue
        // TODO: Remove after backend CORS fixed - uncomment below
        // const freshUser = await apiGetProfile();
        // setUser(freshUser);
        // localStorage.setItem('user', JSON.stringify(freshUser));
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

      if (mounted) {
        setIsLoading(false);
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
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