import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '../schemas/admin.schema';
import { Booking, BookingSchema } from '../schemas/booking.schema';
import { Club, ClubSchema } from '../schemas/club.schema';
import { ClubOwner, ClubOwnerSchema } from '../schemas/club-owner.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: User.name, schema: UserSchema },
      { name: ClubOwner.name, schema: ClubOwnerSchema },
      { name: Club.name, schema: ClubSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
