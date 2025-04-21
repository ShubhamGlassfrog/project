"use client"
import { createContext, useContext, useState, useEffect } from 'react';

// Auth context
const AuthContext = createContext();

// Mock user data
const mockUsers = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', password: 'password', role: 'admin' },
  { id: '2', name: 'Regular User', email: 'user@example.com', password: 'password', role: 'user' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is saved in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock authentication
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    
    if (foundUser) {
      const userData = { ...foundUser };
      delete userData.password;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    
    return { success: false, error: 'Invalid credentials' };
  };

  const loginWithGoogle = async () => {
    // Mock Google authentication
    const userData = {
      id: '3',
      name: 'Google User',
      email: 'google@example.com',
      role: 'user',
      picture: 'https://randomuser.me/api/portraits/men/1.jpg',
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return { success: true, user: userData };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (name, email, password) => {
    // Check if user already exists
    if (mockUsers.some(user => user.email === email)) {
      return { success: false, error: 'User already exists' };
    }
    
    // Create new user
    const newUser = {
      id: String(mockUsers.length + 1),
      name,
      email,
      password,
      role: 'user'
    };
    
    mockUsers.push(newUser);
    
    const userData = { ...newUser };
    delete userData.password;
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    return { success: true, user: userData };
  };

  const value = {
    user,
    loading,
    login,
    loginWithGoogle,
    logout,
    register,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);