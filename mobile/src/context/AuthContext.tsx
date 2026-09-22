import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, ApiError } from '../api';
import { jwtDecode } from 'jwt-decode';

export type UserRole = 'user' | 'admin' | 'clubOwner';

export type User = {
  _id: string;
  email: string;
  fullName?: string;
  role: UserRole;
  plan?: string;
  phone?: string;
};

type JwtPayload = {
  sub: string;
  role: UserRole;
  email: string;
  exp?: number;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

function meEndpointFor(role: UserRole, sub: string): string {
  if (role === 'admin') return `/admins/${sub}`;
  if (role === 'clubOwner') return '/club-owners/me';
  return '/users/me';
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
      if (!token) {
        setLoading(false);
        return;
      }

      const payload = jwtDecode<JwtPayload>(token);

      // Token muddati tugagan bo'lsa tozala
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        await AsyncStorage.removeItem('pcplace_token');
        setLoading(false);
        return;
      }

      const endpoint = meEndpointFor(payload.role, payload.sub);
      const userData = await api.get<any>(endpoint);
      setUser({ ...userData, role: payload.role });
    } catch {
      // Token yaroqsiz — tozala, lekin ilovadan chiqarma
      await AsyncStorage.removeItem('pcplace_token');
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const res = await api.post<{ accessToken: string; user: any }>('/auth/login', { email, password });
    const { accessToken, user: userData } = res;
    const payload = jwtDecode<JwtPayload>(accessToken);

    await AsyncStorage.setItem('pcplace_token', accessToken);
    setUser({ ...userData, role: payload.role });
  }

  async function register(fullName: string, email: string, password: string, phone?: string) {
    const res = await api.post<{ accessToken: string; user: any }>('/auth/register', {
      fullName,
      email,
      password,
      phone,
    });
    const { accessToken, user: userData } = res;
    const payload = jwtDecode<JwtPayload>(accessToken);

    await AsyncStorage.setItem('pcplace_token', accessToken);
    setUser({ ...userData, role: payload.role });
  }

  async function refreshUser() {
    const token = await AsyncStorage.getItem('pcplace_token');
    if (!token) return;
    const payload = jwtDecode<JwtPayload>(token);
    const endpoint = meEndpointFor(payload.role, payload.sub);
    const userData = await api.get<any>(endpoint);
    setUser({ ...userData, role: payload.role });
  }

  async function logout() {
    await AsyncStorage.removeItem('pcplace_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
