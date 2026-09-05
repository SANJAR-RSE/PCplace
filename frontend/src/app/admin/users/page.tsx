'use client';

import { RequireRole } from '@/components/require-role';
import { AdminEntityManager } from '@/components/admin-entity-manager';

export default function AdminUsersPage() {
  return (
    <RequireRole roles={['admin']}>
      <AdminEntityManager resource="users" title="Foydalanuvchilar" subtitle="Barcha ro'yxatdan o'tgan userlar." />
    </RequireRole>
  );
}
