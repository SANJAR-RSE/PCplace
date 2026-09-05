import { BarChart3, Building2, CalendarCheck2, CreditCard, Gamepad2, MapPin, Shield, User as UserIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

export function itemsForRole(role: string | null): NavItem[] {
  if (role === 'admin') {
    return [
      { href: '/admin', label: 'Statistika', icon: BarChart3 },
      { href: '/admin/clubs', label: 'Klublar', icon: Gamepad2 },
      { href: '/admin/users', label: 'Userlar', icon: UserIcon },
      { href: '/admin/club-owners', label: 'Egalari', icon: Building2 },
      { href: '/admin/admins', label: 'Adminlar', icon: Shield },
    ];
  }
  if (role === 'clubOwner') {
    return [
      { href: '/owner', label: 'Klubim', icon: Building2 },
      { href: '/owner/bookings', label: 'Bronlar', icon: CalendarCheck2 },
      { href: '/subscriptions', label: 'Obuna', icon: CreditCard },
    ];
  }
  if (role === 'user') {
    return [
      { href: '/clubs', label: 'Xarita', icon: MapPin },
      { href: '/profile', label: 'Profil', icon: UserIcon },
      { href: '/subscriptions', label: 'Obuna', icon: CreditCard },
    ];
  }
  return [{ href: '/clubs', label: 'Xarita', icon: MapPin }];
}

export function isNavActive(pathname: string, href: string): boolean {
  if (href === '/clubs' || href === '/owner' || href === '/admin') {
    return pathname === href || (href !== '/admin' && href !== '/owner' && pathname.startsWith(`${href}/`));
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
