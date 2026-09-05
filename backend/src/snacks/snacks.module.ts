import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Club, ClubSchema } from '../schemas/club.schema';
import { Snack, SnackSchema } from '../schemas/snack.schema';
import { SnacksController } from './snacks.controller';
import { SnacksService } from './snacks.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Snack.name, schema: SnackSchema },
      { name: Club.name, schema: ClubSchema },
    ]),
  ],
  controllers: [SnacksController],
  providers: [SnacksService],
  exports: [SnacksService],
})
export class SnacksModule {}
