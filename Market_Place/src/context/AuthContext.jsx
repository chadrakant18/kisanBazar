import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('kisanbazaar_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('kisanbazaar_user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('kisanbazaar_user');
  }, []);

  const register = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('kisanbazaar_user', JSON.stringify(userData));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
