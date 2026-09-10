'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { Theme, useTheme } from '@/components/theme-provider';

const options: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Yorug\'', icon: Sun },
  { value: 'dark', label: 'Qorong\'i', icon: Moon },
  { value: 'system', label: 'Sistema', icon: Monitor },
];

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  if (compact) {
    const currentIndex = options.findIndex((option) => option.value === theme);
    const current = options[currentIndex];
    const Icon = current.icon;
    return (
      <button
        type="button"
        onClick={() => setTheme(options[(currentIndex + 1) % options.length].value)}
        className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-white text-foreground/70"
        aria-label={`Mavzu: ${current.label}. O'zgartirish`}
        title={`Mavzu: ${current.label}`}
      >
        <Icon size={17} />
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-border/70 bg-slate-50/70 p-1" aria-label="Mavzu tanlash">
      <div className="grid grid-cols-3 gap-1">
        {options.map((option) => {
          const Icon = option.icon;
          const active = theme === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              className={`flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px] font-bold transition ${
                active ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-foreground'
              }`}
              aria-pressed={active}
            >
              <Icon size={15} />
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
