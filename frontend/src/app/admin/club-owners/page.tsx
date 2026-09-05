'use client';

import { RequireRole } from '@/components/require-role';
import { AdminEntityManager } from '@/components/admin-entity-manager';

export default function AdminClubOwnersPage() {
  return (
    <RequireRole roles={['admin']}>
      <AdminEntityManager resource="club-owners" title="Klub egalari" subtitle="Kompyuterhona egalarini yarating va boshqaring." />
    </RequireRole>
  );
}
