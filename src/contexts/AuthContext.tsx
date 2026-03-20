'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  user: { name: string; email: string; id: string; tier: string; initials: string } | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthContextType['user']>(null);

  useEffect(() => {
    const stored = localStorage.getItem('seq_auth');
    if (stored) {
      const data = JSON.parse(stored);
      setIsLoggedIn(true);
      setUser(data);
    }
  }, []);

  const login = (email: string) => {
    const userData = {
      name: 'Todd Billings',
      email,
      id: '222902',
      tier: 'Active Consultant',
      initials: 'TB',
    };
    localStorage.setItem('seq_auth', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('seq_auth');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
