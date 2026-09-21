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
  exp?: number;
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
        // Token amal qilish muddatini tekshirish
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          await AsyncStorage.removeItem('pcplace_token');
          setLoading(false);
          return;
        }
        // Rolga qarab to'g'ri endpointdan user ma'lumotini olish
        const endpoint = meEndpointFor(payload.role, payload.sub);
        const userData = await api.get<User>(endpoint);
        setUser({ ...userData, role: payload.role });
      }
    } catch (err) {
      await AsyncStorage.removeItem('pcplace_token');
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    // Backend { accessToken, user } qaytaradi
    const res = await api.post<{ accessToken: string; user: User }>('/auth/login', { email, password });
    const { accessToken, user } = res;
    const payload = jwtDecode<JwtPayload>(accessToken);
    
    await AsyncStorage.setItem('pcplace_token', accessToken);
    // Backend login javobidagi user ni to'g'ridan-to'g'ri ishlat + rolni qo'sh
    setUser({ ...user, role: payload.role });
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
