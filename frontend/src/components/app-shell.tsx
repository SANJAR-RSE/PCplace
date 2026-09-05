'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Sidebar, SidebarContent } from '@/components/sidebar';

const NO_SHELL_ROUTES = ['/login', '/register'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (NO_SHELL_ROUTES.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Mobil: yuqori panel + tortiladigan menyu */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-surface/90 px-4 py-3 backdrop-blur md:hidden">
          <span className="flex items-center gap-2 text-base font-bold text-primary">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-white">P</span>
            PCplace
          </span>
          <button
            onClick={() => setDrawerOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-border"
            aria-label="Menyuni ochish"
          >
            <div className="space-y-1">
              <span className="block h-0.5 w-5 bg-foreground" />
              <span className="block h-0.5 w-5 bg-foreground" />
              <span className="block h-0.5 w-5 bg-foreground" />
            </div>
          </button>
        </div>

        <main className="flex-1">{children}</main>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            style={{ animation: 'overlay-in 0.2s ease-out' }}
            onClick={() => setDrawerOpen(false)}
          />
          <div
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-surface pb-[env(safe-area-inset-bottom)] shadow-2xl"
            style={{ animation: 'sheet-in 0.25s ease-out' }}
          >
            <div className="flex justify-center pt-2.5">
              <span className="h-1.5 w-10 rounded-full bg-border" />
            </div>
            <SidebarContent onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
