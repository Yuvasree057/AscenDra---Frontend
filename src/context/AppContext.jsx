import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('ascendra_token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('ascendra_user')) || null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Re-fetch profile on load if token exists
  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      } else {
        // Token invalid or expired
        logout();
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
    setIsLoading(false);
  };

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('ascendra_token', newToken);
    localStorage.setItem('ascendra_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setProfile(null);
    localStorage.removeItem('ascendra_token');
    localStorage.removeItem('ascendra_user');
  };

  return (
    <AppContext.Provider value={{ token, user, profile, isLoading, login, logout, fetchProfile }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
