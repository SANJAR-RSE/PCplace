import { IsEnum } from 'class-validator';
import { BillingCycle, PlanType } from '../../common/enums/plan.enum';

export class PurchaseSubscriptionDto {
  @IsEnum([PlanType.PRO, PlanType.MAX])
  plan: PlanType.PRO | PlanType.MAX;

  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;
}
