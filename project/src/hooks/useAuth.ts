import { useState, useEffect } from 'react';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check
    const checkAuth = async () => {
      setTimeout(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        setLoading(false);
      }, 1000);
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newUser: User = {
        id: 'user-123',
        email,
        name: email.split('@')[0],
        isAuthenticated: true,
        plan: 'free'
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setLoading(false);
    }, 1500);
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    setTimeout(() => {
      const newUser: User = {
        id: 'user-' + Date.now(),
        email,
        name,
        isAuthenticated: true,
        plan: 'free'
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setLoading(false);
    }, 1500);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };
};