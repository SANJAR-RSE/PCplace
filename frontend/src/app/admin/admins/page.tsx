'use client';

import { RequireRole } from '@/components/require-role';
import { AdminEntityManager } from '@/components/admin-entity-manager';

export default function AdminAdminsPage() {
  return (
    <RequireRole roles={['admin']}>
      <AdminEntityManager resource="admins" title="Adminlar" subtitle="Tizim adminlarini boshqarish." withPhone={false} />
    </RequireRole>
  );
}
