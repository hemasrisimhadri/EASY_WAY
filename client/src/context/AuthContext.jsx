import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('easyway_token') || null);
  const [loading, setLoading] = useState(true);

  // Load current user profile if token exists on mount
  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem('easyway_token');
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();
        if (response.data && response.data.data) {
          setUser(response.data.data);
        }
      } catch (err) {
        console.warn('Authentication token invalid or expired:', err.message);
        localStorage.removeItem('easyway_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    const { token: receivedToken, user: loggedUser } = response.data.data;
    localStorage.setItem('easyway_token', receivedToken);
    setToken(receivedToken);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    const { token: receivedToken, user: registeredUser } = response.data.data;
    localStorage.setItem('easyway_token', receivedToken);
    setToken(receivedToken);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = useCallback(() => {
    localStorage.removeItem('easyway_token');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = (updatedUserData) => {
    setUser((prev) => ({ ...prev, ...updatedUserData }));
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';
  const isPatient = user?.role === 'patient';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isPatient,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
