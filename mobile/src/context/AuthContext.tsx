import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api';
import { jwtDecode } from 'jwt-decode';

type User = {
  _id: string;
  email: string;
  fullName?: string;
  role: string;
  plan?: string;
};

type JwtPayload = {
  sub: string;
  role: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

function meEndpointFor(role: string, sub: string): string {
  if (role === 'admin') return `/admins/${sub}`;
  if (role === 'clubOwner') return '/club-owners/me';
  return `/users/${sub}`;
}

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
        const payload = jwtDecode<JwtPayload>(token);
        // "proxy fetching" orqali to'g'ri endpointdan user ma'lumotlarini olish
        const res = await api.get(meEndpointFor(payload.role, payload.sub));
        // api.get endi to'g'ridan to'g'ri datani qaytaradi (fetch wrapper)
        setUser(res);
      }
    } catch (err) {
      await AsyncStorage.removeItem('pcplace_token');
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const res = await api.post<{ accessToken: string }>('/auth/login', { email, password });
    const token = res.accessToken;
    const payload = jwtDecode<JwtPayload>(token);
    
    await AsyncStorage.setItem('pcplace_token', token);
    const userData = await api.get(meEndpointFor(payload.role, payload.sub));
    setUser(userData);
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
