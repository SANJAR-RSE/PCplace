import Link from 'next/link';
import { Badge } from '@/components/ui';
import type { Club } from '@/types';

export function ClubCard({ club }: { club: Club }) {
  return (
    <Link
      href={`/clubs/${club._id}`}
      className="block overflow-hidden rounded-2xl border border-border bg-surface transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-36 items-center justify-center bg-gradient-to-br from-primary/15 to-accent/15 text-4xl">
        {club.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={club.imageUrl} alt={club.name} className="h-full w-full object-cover" />
        ) : (
          '🎮'
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold">{club.name}</h3>
          {club.isPromoted && <Badge tone="warning">TOP</Badge>}
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-muted">{club.address}</p>
        <p className="mt-2 text-sm font-medium">
          ⭐ {club.ratingAverage.toFixed(1)} <span className="text-muted">({club.ratingCount} izoh)</span>
        </p>
      </div>
    </Link>
  );
}
