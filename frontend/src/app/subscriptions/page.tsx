'use client';

import { useEffect, useState } from 'react';
import { Check, Crown, Zap } from 'lucide-react';
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
  pro: ["Cheklovsiz xona/PC qo'shish", 'Batafsil statistika', 'Izohlarga javob berish'],
  max: ["Pro'dagi barchasi", "Xarita/qidiruvda yuqori o'rin", 'Kengaytirilgan analitika', 'Ustuvor texnik yordam'],
};

const planConfig = {
  pro: {
    icon: Zap,
    gradient: 'from-[var(--primary)] to-[var(--primary-dark)]',
    glow: 'shadow-[0_0_30px_var(--primary-glow)]',
    hoverGlow: 'hover:shadow-[0_0_50px_var(--primary-glow)]',
    border: 'border-[var(--primary)]/30',
    badge: 'bg-[var(--primary)]/10 text-[var(--primary)]',
  },
  max: {
    icon: Crown,
    gradient: 'from-amber-500 to-orange-600',
    glow: 'shadow-[0_0_30px_rgba(251,191,36,0.35)]',
    hoverGlow: 'hover:shadow-[0_0_50px_rgba(251,191,36,0.5)]',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/10 text-amber-400',
  },
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
      setError(err instanceof ApiError ? err.message : "To'lov amalga oshmadi");
    } finally {
      setPurchasing(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <PageHeader
        title="Pro / Max obuna"
        subtitle={`Joriy tarif: ${(user?.plan ?? 'free').toUpperCase()}`}
        action={
          active && (
            <Badge tone="success">
              Faol: {active.plan.toUpperCase()} · {new Date(active.endDate).toLocaleDateString('uz-UZ')} gacha
            </Badge>
          )
        }
      />

      <ErrorText>{error}</ErrorText>

      {/* Billing cycle toggle */}
      <div className="mb-8 flex items-center gap-3">
        <div className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1">
          {(['monthly', 'yearly'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCycle(c)}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                cycle === c
                  ? 'bg-[var(--primary)] text-white shadow-[0_0_14px_var(--primary-glow)]'
                  : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              {c === 'monthly' ? 'Oylik' : 'Yillik'}
            </button>
          ))}
        </div>
        {cycle === 'yearly' && (
          <span className="rounded-full bg-[var(--accent)]/15 px-3 py-1 text-xs font-bold text-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]">
            45% tejamkor
          </span>
        )}
      </div>

      {/* Plan cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        {(['pro', 'max'] as const).map((plan) => {
          const cfg = planConfig[plan];
          const Icon = cfg.icon;
          const isActive = active?.plan === plan;
          return (
            <div
              key={plan}
              className={`relative overflow-hidden rounded-2xl border bg-[var(--surface)] p-6 transition-all duration-300 ${cfg.border} ${
                isActive ? `${cfg.glow} ${cfg.hoverGlow}` : 'hover:border-[var(--primary)]/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
              }`}
            >
              {/* Top gradient line */}
              <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${cfg.gradient} opacity-60`} />

              {/* Active badge */}
              {isActive && (
                <div className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${cfg.badge}`}>
                  Faol
                </div>
              )}

              {/* Plan header */}
              <div className="mb-5 flex items-center gap-3">
                <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${cfg.gradient} shadow-lg`}>
                  <Icon size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wider text-[var(--foreground)]">{plan}</h2>
                  <p className="text-xs text-[var(--muted)]">{plan === 'pro' ? 'Professional' : 'Maximum'}</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[var(--foreground)]">
                    ${PLAN_PRICES[plan][cycle]}
                  </span>
                  <span className="text-sm text-[var(--muted)]">/ {cycle === 'monthly' ? 'oy' : 'yil'}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="mb-6 space-y-2.5">
                {features[plan].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[var(--foreground)]/80">
                    <Check size={15} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                className={`w-full ${isActive ? '' : `bg-gradient-to-r ${cfg.gradient}`}`}
                variant={isActive ? 'secondary' : 'primary'}
                disabled={purchasing !== null || isActive}
                onClick={() => purchase(plan)}
              >
                {isActive ? 'Faol tarif' : purchasing === plan ? "To'lanmoqda…" : "Sotib olish"}
              </Button>
            </div>
          );
        })}
      </div>

      {/* History */}
      <Card className="mt-8">
        <h2 className="mb-4 font-semibold text-[var(--foreground)]">Obunalar tarixi</h2>
        {subs === null ? (
          <div className="flex justify-center py-4"><Spinner /></div>
        ) : subs.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">Hali obuna sotib olinmagan.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {subs.map((s) => (
              <li key={s._id} className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-2 last:border-0">
                <span className="font-medium text-[var(--foreground)]">
                  {s.plan.toUpperCase()} · {s.billingCycle === 'monthly' ? 'oylik' : 'yillik'}
                </span>
                <span className="text-[var(--muted)]">
                  {new Date(s.startDate).toLocaleDateString('uz-UZ')} – {new Date(s.endDate).toLocaleDateString('uz-UZ')}
                </span>
                <Badge tone={s.status === 'active' ? 'success' : s.status === 'expired' ? 'default' : 'danger'}>
                  {s.status}
                </Badge>
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
