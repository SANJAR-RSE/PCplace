'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { decodeJwt } from '@/lib/jwt';
import type { AuthResponse, CurrentUser, Role } from '@/types';

interface AuthState {
  token: string | null;
  role: Role | null;
  user: CurrentUser | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'pcplace_token';

// Cookie'ga token saqlash (middleware server tomonida o'qishi uchun)
function saveTokenCookie(token: string) {
  // 7 kunlik cookie, SameSite=Strict, Secure (HTTPS da)
  const maxAge = 60 * 60 * 24 * 7;
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${maxAge}; SameSite=Strict`;
}

function clearTokenCookie() {
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Strict`;
}

function meEndpointFor(role: Role, sub: string): string {
  if (role === 'admin') return `/admins/${sub}`;
  if (role === 'clubOwner') return '/club-owners/me';
  return '/users/me';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ token: null, role: null, user: null, loading: true });

  const applyAuth = useCallback((res: AuthResponse) => {
    // localStorage — tez o'qish uchun
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    // cookie — middleware (server-side) o'qishi uchun
    saveTokenCookie(res.accessToken);

    const payload = decodeJwt(res.accessToken);
    setState({ token: res.accessToken, role: payload?.role ?? null, user: res.user, loading: false });
  }, []);

  const refreshMe = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      clearTokenCookie();
      setState({ token: null, role: null, user: null, loading: false });
      return;
    }
    const payload = decodeJwt(token);
    if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
      localStorage.removeItem(TOKEN_KEY);
      clearTokenCookie();
      setState({ token: null, role: null, user: null, loading: false });
      return;
    }
    // Cookie'ni ham yangilab qo'yamiz (browser yangilanganda yo'qolib ketmasligi uchun)
    saveTokenCookie(token);
    try {
      const user = await api.get<CurrentUser>(meEndpointFor(payload.role, payload.sub));
      setState({ token, role: payload.role, user, loading: false });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        clearTokenCookie();
        setState({ token: null, role: null, user: null, loading: false });
      } else {
        setState({ token, role: payload.role, user: { _id: payload.sub, fullName: '', email: payload.email }, loading: false });
      }
    }
  }, []);

  useEffect(() => {
    refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.post<AuthResponse>('/auth/login', { email, password });
      applyAuth(res);
    },
    [applyAuth],
  );

  const register = useCallback(
    async (fullName: string, email: string, password: string, phone?: string) => {
      const res = await api.post<AuthResponse>('/auth/register', { fullName, email, password, phone });
      applyAuth(res);
    },
    [applyAuth],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    clearTokenCookie();
    setState({ token: null, role: null, user: null, loading: false });
  }, []);

  const value = useMemo(
    () => ({ ...state, login, register, logout, refreshMe }),
    [state, login, register, logout, refreshMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth AuthProvider ichida ishlatilishi kerak');
  return ctx;
}
