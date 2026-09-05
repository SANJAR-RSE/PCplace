'use client';

import { FormEvent, useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import { Badge, Button, Card, EmptyState, ErrorText, Field, Input, PageHeader, Spinner } from '@/components/ui';

interface Entity {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  isActive: boolean;
}

export function AdminEntityManager({
  resource,
  title,
  subtitle,
  withPhone = true,
}: {
  resource: 'users' | 'club-owners' | 'admins';
  title: string;
  subtitle: string;
  withPhone?: boolean;
}) {
  const [items, setItems] = useState<Entity[] | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  function load() {
    api.get<Entity[]>(`/${resource}`).then(setItems).catch(() => setItems([]));
  }
  useEffect(load, [resource]);

  async function createItem(e: FormEvent) {
    e.preventDefault();
    setError('');
    setCreating(true);
    try {
      await api.post(`/${resource}`, { fullName, email, password, phone: withPhone ? phone || undefined : undefined });
      setFullName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setShowCreate(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Yaratilmadi');
    } finally {
      setCreating(false);
    }
  }

  async function toggleActive(item: Entity) {
    try {
      await api.patch(`/${resource}/${item._id}`, { isActive: !item.isActive });
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Yangilanmadi');
    }
  }

  async function remove(id: string) {
    try {
      await api.delete(`/${resource}/${id}`);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'O‘chirib bo‘lmadi');
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={
          <Button variant="secondary" onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? 'Bekor qilish' : '+ Yangi qo\'shish'}
          </Button>
        }
      />

      <ErrorText>{error}</ErrorText>

      {showCreate && (
        <Card className="mb-6">
          <form onSubmit={createItem}>
            <Field label="To'liq ism">
              <Input required minLength={2} value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </Field>
            <Field label="Email">
              <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            {withPhone && (
              <Field label="Telefon (ixtiyoriy)">
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </Field>
            )}
            <Field label="Parol">
              <Input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            <Button type="submit" disabled={creating}>
              {creating ? 'Yaratilmoqda…' : 'Yaratish'}
            </Button>
          </form>
        </Card>
      )}

      {items === null ? (
        <Spinner />
      ) : items.length === 0 ? (
        <EmptyState title="Hozircha yozuv yo'q" />
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item._id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-4 py-3">
              <div>
                <p className="font-medium">{item.fullName}</p>
                <p className="text-sm text-muted">
                  {item.email} {item.phone && `· ${item.phone}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={item.isActive ? 'success' : 'danger'}>{item.isActive ? 'faol' : 'bloklangan'}</Badge>
                <Button variant="secondary" onClick={() => toggleActive(item)}>
                  {item.isActive ? 'Bloklash' : 'Faollashtirish'}
                </Button>
                <Button variant="danger" onClick={() => remove(item._id)}>
                  O&apos;chirish
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
