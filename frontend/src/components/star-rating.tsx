import { Star } from 'lucide-react';

// Klub/izoh reytingini bitta yulduzcha ikonka + raqam sifatida ko'rsatadi.
export function RatingBadge({ value, count, size = 16 }: { value: number; count?: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      <Star size={size} className="fill-amber-400 text-amber-400" />
      <span>{value.toFixed(1)}</span>
      {typeof count === 'number' && <span className="text-muted">({count})</span>}
    </span>
  );
}

// To'liq 5 yulduzli qator — izohlarni ko'rsatish uchun.
export function StarRow({ value, max = 5, size = 16 }: { value: number; max?: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star key={i} size={size} className={i < value ? 'fill-amber-400 text-amber-400' : 'text-border'} />
      ))}
    </span>
  );
}

// Bosiladigan yulduz tanlagich — izoh qoldirish formasi uchun.
export function StarPicker({ value, onChange, size = 22 }: { value: number; onChange: (n: number) => void; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const n = i + 1;
        return (
          <button key={n} type="button" onClick={() => onChange(n)} className="p-0.5">
            <Star size={size} className={n <= value ? 'fill-amber-400 text-amber-400' : 'text-border'} />
          </button>
        );
      })}
    </span>
  );
}
