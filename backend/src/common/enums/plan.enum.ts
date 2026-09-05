export enum PlanType {
  FREE = 'free',
  PRO = 'pro',
  MAX = 'max',
}

export enum BillingCycle {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

// Spec 9-bo'lim: Pro va Max narxlari tasdiqlangan (yillik — oylikning ~45%iga chegirma bilan).
export const PLAN_PRICES: Record<PlanType.PRO | PlanType.MAX, Record<BillingCycle, number>> = {
  [PlanType.PRO]: { [BillingCycle.MONTHLY]: 5, [BillingCycle.YEARLY]: 27 },
  [PlanType.MAX]: { [BillingCycle.MONTHLY]: 15, [BillingCycle.YEARLY]: 81 },
};
