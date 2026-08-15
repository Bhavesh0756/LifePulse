import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on app load
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await authService.getMe();
        if (res.success && res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        // Unauthenticated or expired session
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  // Login handler
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const res = await authService.login(credentials);
      if (res.success && res.data.user) {
        setUser(res.data.user);
        return res.data.user;
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (userData) => {
    setIsLoading(true);
    try {
      const res = await authService.register(userData);
      if (res.success && res.data.user) {
        setUser(res.data.user);
        return res.data.user;
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.warn('[Logout Notice]: Server cookie clear attempt:', err.message);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  // Update Profile handler
  const updateUserProfile = async (profileData) => {
    const res = await authService.updateProfile(profileData);
    if (res.success && res.data.user) {
      setUser(res.data.user);
      return res.data.user;
    }
    return null;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUserProfile,
    hasRole: (requiredRole) => user?.role === requiredRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
