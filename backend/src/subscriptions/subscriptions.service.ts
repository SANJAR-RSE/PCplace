import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from '../common/enums/role.enum';
import { BillingCycle, PLAN_PRICES, PlanType, SubscriptionStatus } from '../common/enums/plan.enum';
import { Club, ClubDocument } from '../schemas/club.schema';
import { ClubOwner, ClubOwnerDocument } from '../schemas/club-owner.schema';
import { Subscription, SubscriptionDocument, SubscriberType } from '../schemas/subscription.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { PurchaseSubscriptionDto } from './dto/purchase-subscription.dto';
import { PAYMENT_PROVIDER, PaymentProvider } from './payment/payment-provider.interface';

function addCycle(date: Date, cycle: BillingCycle): Date {
  const result = new Date(date);
  if (cycle === BillingCycle.MONTHLY) {
    result.setMonth(result.getMonth() + 1);
  } else {
    result.setFullYear(result.getFullYear() + 1);
  }
  return result;
}

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(ClubOwner.name) private clubOwnerModel: Model<ClubOwnerDocument>,
    @InjectModel(Club.name) private clubModel: Model<ClubDocument>,
    @Inject(PAYMENT_PROVIDER) private paymentProvider: PaymentProvider,
  ) {}

  async purchase(subscriberId: string, role: Role, dto: PurchaseSubscriptionDto) {
    if (role !== Role.USER && role !== Role.CLUB_OWNER) {
      throw new BadRequestException('Faqat User yoki Klub egasi obuna sotib olishi mumkin');
    }
    const subscriberModel = role === Role.USER ? SubscriberType.USER : SubscriberType.CLUB_OWNER;
    const amount = PLAN_PRICES[dto.plan][dto.billingCycle];

    const payment = await this.paymentProvider.charge(amount, {
      subscriberId,
      plan: dto.plan,
      billingCycle: dto.billingCycle,
    });
    if (!payment.success) {
      throw new BadRequestException('To‘lov amalga oshmadi');
    }

    const startDate = new Date();
    const endDate = addCycle(startDate, dto.billingCycle);

    const subscription = await this.subscriptionModel.create({
      subscriber: subscriberId,
      subscriberModel,
      plan: dto.plan,
      billingCycle: dto.billingCycle,
      startDate,
      endDate,
      status: SubscriptionStatus.ACTIVE,
      amountPaid: amount,
      paymentProvider: 'mock',
      paymentReference: payment.reference,
    });

    if (subscriberModel === SubscriberType.USER) {
      await this.userModel.findByIdAndUpdate(subscriberId, { plan: dto.plan });
    } else {
      await this.clubOwnerModel.findByIdAndUpdate(subscriberId, { plan: dto.plan });
      // Max: klublar xarita/qidiruvda yuqoriroqda chiqadi (spec 9.1).
      if (dto.plan === PlanType.MAX) {
        await this.clubModel.updateMany({ owner: subscriberId }, { isPromoted: true });
      }
    }

    return subscription;
  }

  findMine(subscriberId: string) {
    return this.subscriptionModel.find({ subscriber: subscriberId }).sort({ createdAt: -1 });
  }

  // Joriy amaldagi (muddati o'tmagan) tarifni qaytaradi; muddati o'tgan bo'lsa lazy-expire qiladi.
  async getActivePlan(subscriberId: string, role: Role): Promise<PlanType> {
    const subscriberModel = role === Role.USER ? SubscriberType.USER : SubscriberType.CLUB_OWNER;
    const latest = await this.subscriptionModel
      .findOne({ subscriber: subscriberId, subscriberModel, status: SubscriptionStatus.ACTIVE })
      .sort({ endDate: -1 });

    if (!latest) return PlanType.FREE;

    if (latest.endDate.getTime() < Date.now()) {
      latest.status = SubscriptionStatus.EXPIRED;
      await latest.save();
      if (subscriberModel === SubscriberType.USER) {
        await this.userModel.findByIdAndUpdate(subscriberId, { plan: PlanType.FREE });
      } else {
        await this.clubOwnerModel.findByIdAndUpdate(subscriberId, { plan: PlanType.FREE });
        await this.clubModel.updateMany({ owner: subscriberId }, { isPromoted: false });
      }
      return PlanType.FREE;
    }

    return latest.plan;
  }
}
