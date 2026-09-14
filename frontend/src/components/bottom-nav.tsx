'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { isNavActive, itemsForRole } from '@/lib/nav-items';

export function BottomNav() {
  const { role } = useAuth();
  const pathname = usePathname();
  const items = itemsForRole(role);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--surface)]/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      {/* Top neon glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)]/30 to-transparent" />

      <div className="flex">
        {items.map((item) => {
          const active = isNavActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href as never}
              className={`relative flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                active ? 'text-[var(--primary)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              {/* Neon active dot on top */}
              {active && (
                <span className="absolute top-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-[var(--primary)] shadow-[0_0_6px_var(--primary-glow)]" />
              )}

              <span className={`transition-transform duration-200 ${active ? 'scale-110 drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]' : ''}`}>
                <Icon size={20} />
              </span>

              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
