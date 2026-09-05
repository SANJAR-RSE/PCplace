import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRES_PLAN_KEY } from '../common/decorators/requires-plan.decorator';
import { Role } from '../common/enums/role.enum';
import { PlanType } from '../common/enums/plan.enum';
import { SubscriptionsService } from './subscriptions.service';

const PLAN_RANK: Record<PlanType, number> = {
  [PlanType.FREE]: 0,
  [PlanType.PRO]: 1,
  [PlanType.MAX]: 2,
};

// @RequiresPlan(PlanType.PRO) qo'yilgan endpointlarni himoya qiladi (Max ham Pro talabini qondiradi).
@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private subscriptionsService: SubscriptionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPlan = this.reflector.getAllAndOverride<PlanType.PRO | PlanType.MAX>(REQUIRES_PLAN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPlan) return true;

    const { user } = context.switchToHttp().getRequest();
    const role: Role = user?.role;
    const activePlan = await this.subscriptionsService.getActivePlan(user.sub, role);

    if (PLAN_RANK[activePlan] < PLAN_RANK[requiredPlan]) {
      throw new ForbiddenException(`Bu funksiya uchun ${requiredPlan.toUpperCase()} obuna kerak`);
    }
    return true;
  }
}
