import { SetMetadata } from '@nestjs/common';
import { PlanType } from '../enums/plan.enum';

export const REQUIRES_PLAN_KEY = 'requiresPlan';
// masalan @RequiresPlan(PlanType.PRO) — kamida Pro (Max ham qabul qilinadi)
export const RequiresPlan = (plan: PlanType.PRO | PlanType.MAX) => SetMetadata(REQUIRES_PLAN_KEY, plan);
