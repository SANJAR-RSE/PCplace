export interface PaymentChargeResult {
  success: boolean;
  reference: string;
}

export interface PaymentProvider {
  charge(amount: number, meta: Record<string, unknown>): Promise<PaymentChargeResult>;
}

export const PAYMENT_PROVIDER = 'PAYMENT_PROVIDER';
