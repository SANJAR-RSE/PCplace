import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Club, ClubSchema } from '../schemas/club.schema';
import { ClubOwner, ClubOwnerSchema } from '../schemas/club-owner.schema';
import { Subscription, SubscriptionSchema } from '../schemas/subscription.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { MockPaymentProvider } from './payment/mock-payment.provider';
import { PAYMENT_PROVIDER } from './payment/payment-provider.interface';
import { SubscriptionGuard } from './subscription.guard';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: User.name, schema: UserSchema },
      { name: ClubOwner.name, schema: ClubOwnerSchema },
      { name: Club.name, schema: ClubSchema },
    ]),
  ],
  controllers: [SubscriptionsController],
  providers: [
    SubscriptionsService,
    SubscriptionGuard,
    { provide: PAYMENT_PROVIDER, useClass: MockPaymentProvider },
  ],
  exports: [SubscriptionsService, SubscriptionGuard],
})
export class SubscriptionsModule {}
