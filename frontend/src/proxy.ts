import { NextRequest, NextResponse } from 'next/server';

// Himoyalangan sahifalar — token bo'lmasa /login ga yo'naltiradi
const PROTECTED_ROUTES = [
  '/profile',
  '/settings',
  '/subscriptions',
  '/owner',
  '/admin',
];

// Faqat login bo'lmagan foydalanuvchilar uchun
const AUTH_ROUTES = ['/login', '/register'];

// Token payload'idan rol o'qish (base64 decode)
function getRoleFromToken(token: string): string | null {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(
      Buffer.from(payload, 'base64').toString('utf8'),
    );
    if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;
    return decoded.role ?? null;
  } catch {
    return null;
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('pcplace_token')?.value ?? '';

  const role = token ? getRoleFromToken(token) : null;
  const isLoggedIn = !!role;

  // Login bo'lgan foydalanuvchi /login yoki /register ga kirmaydi
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/clubs', req.url));
    }
    return NextResponse.next();
  }

  // Himoyalangan sahifalar — token bo'lmasa login ga yo'naltir
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // /admin — faqat 'admin' role
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/clubs', req.url));
    }

    // /owner — faqat 'clubOwner' role
    if (pathname.startsWith('/owner') && role !== 'clubOwner') {
      return NextResponse.redirect(new URL('/clubs', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/profile/:path*',
    '/settings/:path*',
    '/subscriptions/:path*',
    '/owner/:path*',
    '/admin/:path*',
  ],
};
