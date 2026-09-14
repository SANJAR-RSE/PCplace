'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

type ThemeContextValue = { theme: Theme; setTheme: (theme: Theme) => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolvedTheme(theme: Theme): 'dark' | 'light' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default: 'dark' — gaming platformaga mos
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = window.localStorage.getItem('pcplace-theme');
    return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'dark';
  });

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const resolved = resolvedTheme(theme);
      // Eski 'dark' classni olib tashlaymiz, gaming tema uchun 'light' class ishlatamiz
      document.documentElement.classList.remove('dark', 'light');
      if (resolved === 'light') {
        document.documentElement.classList.add('light');
      }
      // Dark — default, hech qanday class yo'q (`:root` CSS ishlatiladi)
    };
    apply();
    window.localStorage.setItem('pcplace-theme', theme);
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}
