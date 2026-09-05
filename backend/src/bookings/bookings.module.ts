import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from '../schemas/booking.schema';
import { Club, ClubSchema } from '../schemas/club.schema';
import { Pc, PcSchema } from '../schemas/pc.schema';
import { Room, RoomSchema } from '../schemas/room.schema';
import { Snack, SnackSchema } from '../schemas/snack.schema';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Pc.name, schema: PcSchema },
      { name: Room.name, schema: RoomSchema },
      { name: Snack.name, schema: SnackSchema },
      { name: Club.name, schema: ClubSchema },
    ]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
