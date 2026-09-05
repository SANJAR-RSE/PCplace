import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { BillingCycle, PlanType, SubscriptionStatus } from '../common/enums/plan.enum';

export type SubscriptionDocument = Subscription & Document;

export enum SubscriberType {
  USER = 'User',
  CLUB_OWNER = 'ClubOwner',
}

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, refPath: 'subscriberModel', index: true })
  subscriber: Types.ObjectId;

  @Prop({ type: String, enum: SubscriberType, required: true })
  subscriberModel: SubscriberType;

  @Prop({ type: String, enum: [PlanType.PRO, PlanType.MAX], required: true })
  plan: PlanType.PRO | PlanType.MAX;

  @Prop({ type: String, enum: BillingCycle, required: true })
  billingCycle: BillingCycle;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: String, enum: SubscriptionStatus, default: SubscriptionStatus.ACTIVE })
  status: SubscriptionStatus;

  @Prop({ default: false })
  autoRenew: boolean;

  @Prop({ required: true, min: 0 })
  amountPaid: number;

  @Prop()
  paymentProvider?: string; // masalan "payme" | "click" | "mock"

  @Prop()
  paymentReference?: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
