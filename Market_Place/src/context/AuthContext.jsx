import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('kisanbazaar_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = useCallback(async (credentials) => {
    try {
      const res = await fetch('http://127.0.0.1:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      setUser(data.user);
      localStorage.setItem('kisanbazaar_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('kisanbazaar_user');
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const res = await fetch('http://127.0.0.1:5001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      
      setUser(data.user);
      localStorage.setItem('kisanbazaar_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      throw err;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
