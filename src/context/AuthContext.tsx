import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default users for demo
const defaultUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@tms.com',
    phone: '+1234567890',
    role: 'admin',
    password: 'admin123',
    status: 'active',
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'John Driver',
    email: 'driver@tms.com',
    phone: '+1234567891',
    role: 'driver',
    password: 'driver123',
    status: 'active',
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Jane Customer',
    email: 'customer@tms.com',
    phone: '+1234567892',
    role: 'customer',
    password: 'customer123',
    status: 'active',
    createdAt: new Date(),
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('tms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string, role: UserRole): boolean => {
    const foundUser = defaultUsers.find(
      (u) => u.email === email && u.password === password && u.role === role
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('tms_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tms_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
