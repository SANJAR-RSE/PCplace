'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { Theme, useTheme } from '@/components/theme-provider';

const options: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'dark',   label: "Qorong'i", icon: Moon },
  { value: 'light',  label: "Yorug'",   icon: Sun },
  { value: 'system', label: 'Sistema',  icon: Monitor },
];

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();

  if (compact) {
    const currentIndex = options.findIndex((o) => o.value === theme);
    const current = options[currentIndex];
    const Icon = current.icon;
    return (
      <button
        type="button"
        onClick={() => setTheme(options[(currentIndex + 1) % options.length].value)}
        className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface2)] text-[var(--muted)] transition-all hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
        aria-label={`Mavzu: ${current.label}. O'zgartirish`}
        title={`Mavzu: ${current.label}`}
      >
        <Icon size={17} />
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface2)] p-1" aria-label="Mavzu tanlash">
      <div className="grid grid-cols-3 gap-1">
        {options.map((option) => {
          const Icon = option.icon;
          const active = theme === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              className={`flex flex-col items-center gap-1.5 rounded-lg px-1 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 ${
                active
                  ? 'bg-[var(--primary)]/15 text-[var(--primary)] shadow-[0_0_10px_var(--primary-glow)]'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
              aria-pressed={active}
            >
              <Icon size={16} />
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
