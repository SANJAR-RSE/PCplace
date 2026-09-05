import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PaymentChargeResult, PaymentProvider } from './payment-provider.interface';

/**
 * VAQTINCHALIK provayder — Payme/Click uchun haqiqiy merchant kalitlari hali .env'da yo'q.
 * Real integratsiya qo'shilganda shu joyga PaymeProvider/ClickProvider yozib,
 * SubscriptionsModule'dagi PAYMENT_PROVIDER providerini shunga almashtirish kifoya
 * (SubscriptionsService kodini o'zgartirish shart emas).
 */
@Injectable()
export class MockPaymentProvider implements PaymentProvider {
  async charge(_amount: number, _meta: Record<string, unknown>): Promise<PaymentChargeResult> {
    return { success: true, reference: `mock_${randomUUID()}` };
  }
}
