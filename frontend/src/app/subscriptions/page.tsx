'use client';

import { useEffect, useState } from 'react';
import { RequireRole } from '@/components/require-role';
import { useAuth } from '@/lib/auth-context';
import { api, ApiError } from '@/lib/api';
import { Badge, Button, Card, ErrorText, PageHeader, Spinner } from '@/components/ui';
import type { BillingCycle, PlanType, Subscription } from '@/types';

const PLAN_PRICES: Record<'pro' | 'max', Record<BillingCycle, number>> = {
  pro: { monthly: 5, yearly: 27 },
  max: { monthly: 15, yearly: 81 },
};

const planFeatures: Record<string, string[]> = {
  pro: ['Cheklovsiz bron qilish', 'Bronni ustuvor tasdiqlash', 'Maxsus chegirmalar'],
  max: ["Pro'dagi barchasi", 'VIP xonalarga ustuvor bron', 'Shaxsiy statistika', 'Maxsus badge/status'],
};

const ownerPlanFeatures: Record<string, string[]> = {
  pro: ['Cheklovsiz xona/PC qo‘shish', 'Batafsil statistika', 'Izohlarga javob berish'],
  max: ["Pro'dagi barchasi", 'Xarita/qidiruvda yuqori o‘rin', 'Kengaytirilgan analitika', 'Ustuvor texnik yordam'],
};

function SubscriptionsContent() {
  const { user, role, refreshMe } = useAuth();
  const [subs, setSubs] = useState<Subscription[] | null>(null);
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [purchasing, setPurchasing] = useState<PlanType | null>(null);
  const [error, setError] = useState('');

  function load() {
    api
      .get<Subscription[]>('/subscriptions/mine')
      .then(setSubs)
      .catch(() => setSubs([]));
  }
  useEffect(load, []);

  const active = subs?.find((s) => s.status === 'active');
  const features = role === 'clubOwner' ? ownerPlanFeatures : planFeatures;

  async function purchase(plan: 'pro' | 'max') {
    setError('');
    setPurchasing(plan);
    try {
      await api.post('/subscriptions/purchase', { plan, billingCycle: cycle });
      await refreshMe();
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'To‘lov amalga oshmadi');
    } finally {
      setPurchasing(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader
        title="Pro / Max obuna"
        subtitle={`Joriy tarif: ${(user?.plan ?? 'free').toUpperCase()}`}
        action={active && <Badge tone="success">Faol: {active.plan.toUpperCase()} · {new Date(active.endDate).toLocaleDateString('uz-UZ')} gacha</Badge>}
      />

      <ErrorText>{error}</ErrorText>

      <div className="mb-6 inline-flex rounded-lg border border-border p-1">
        <button
          onClick={() => setCycle('monthly')}
          className={`rounded-md px-4 py-1.5 text-sm font-medium ${cycle === 'monthly' ? 'bg-primary text-white' : ''}`}
        >
          Oylik
        </button>
        <button
          onClick={() => setCycle('yearly')}
          className={`rounded-md px-4 py-1.5 text-sm font-medium ${cycle === 'yearly' ? 'bg-primary text-white' : ''}`}
        >
          Yillik
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {(['pro', 'max'] as const).map((plan) => (
          <Card key={plan} className={active?.plan === plan ? 'ring-2 ring-primary' : ''}>
            <h2 className="text-xl font-bold uppercase">{plan}</h2>
            <p className="mt-1 text-3xl font-extrabold">
              ${PLAN_PRICES[plan][cycle]}
              <span className="text-sm font-normal text-muted"> / {cycle === 'monthly' ? 'oy' : 'yil'}</span>
            </p>
            <ul className="my-4 space-y-2 text-sm text-foreground/80">
              {features[plan].map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
            <Button
              className="w-full"
              disabled={purchasing !== null || active?.plan === plan}
              onClick={() => purchase(plan)}
            >
              {active?.plan === plan ? 'Faol tarif' : purchasing === plan ? 'To‘lanmoqda…' : 'Sotib olish'}
            </Button>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <h2 className="mb-3 font-semibold">Obunalar tarixi</h2>
        {subs === null ? (
          <Spinner />
        ) : subs.length === 0 ? (
          <p className="text-sm text-muted">Hali obuna sotib olinmagan.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {subs.map((s) => (
              <li key={s._id} className="flex justify-between border-b border-border/60 pb-2 last:border-0">
                <span>
                  {s.plan.toUpperCase()} · {s.billingCycle === 'monthly' ? 'oylik' : 'yillik'}
                </span>
                <span className="text-muted">
                  {new Date(s.startDate).toLocaleDateString('uz-UZ')} – {new Date(s.endDate).toLocaleDateString('uz-UZ')}
                </span>
                <Badge tone={s.status === 'active' ? 'success' : s.status === 'expired' ? 'default' : 'danger'}>{s.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

export default function SubscriptionsPage() {
  return (
    <RequireRole roles={['user', 'clubOwner']}>
      <SubscriptionsContent />
    </RequireRole>
  );
}
