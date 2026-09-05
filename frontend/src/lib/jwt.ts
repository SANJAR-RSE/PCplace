import type { Role } from '@/types';

export interface JwtPayload {
  sub: string;
  role: Role;
  email: string;
  exp?: number;
}

// Faqat client-tomonda payload'ni o'qish uchun — imzoni tekshirmaydi
// (imzo tekshiruvi backend tomonida amalga oshiriladi).
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split('.')[1];
    const json = decodeURIComponent(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join(''),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}
