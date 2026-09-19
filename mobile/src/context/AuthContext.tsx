import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api';

type User = {
  _id: string;
  email: string;
  fullName?: string;
  role: string;
  plan?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const token = await AsyncStorage.getItem('pcplace_token');
      if (token) {
        const res = await api.get('/auth/me');
        setUser(res.data);
      }
    } catch (err) {
      await AsyncStorage.removeItem('pcplace_token');
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    await AsyncStorage.setItem('pcplace_token', token);
    setUser(user);
  }

  async function logout() {
    await AsyncStorage.removeItem('pcplace_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
