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

// Spec 9-bo'lim: hozircha Pro va Max narxlari bir xil ko'rsatilgan.
export const PLAN_PRICES: Record<PlanType.PRO | PlanType.MAX, Record<BillingCycle, number>> = {
  [PlanType.PRO]: { [BillingCycle.MONTHLY]: 10, [BillingCycle.YEARLY]: 54 },
  [PlanType.MAX]: { [BillingCycle.MONTHLY]: 10, [BillingCycle.YEARLY]: 54 },
};
