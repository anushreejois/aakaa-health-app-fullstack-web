import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('aakaa_admin_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
            headers: {
              'x-auth-token': token
            }
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Token invalid or expired
            localStorage.removeItem('aakaa_admin_token');
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (err) {
          console.error('Error loading user:', err);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('aakaa_admin_token', data.token);
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: 'Server connection failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('aakaa_admin_token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout }}>
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
