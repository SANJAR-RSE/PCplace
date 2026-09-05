import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClubOwner, ClubOwnerSchema } from '../schemas/club-owner.schema';
import { ClubOwnersController } from './club-owners.controller';
import { ClubOwnersService } from './club-owners.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: ClubOwner.name, schema: ClubOwnerSchema }])],
  controllers: [ClubOwnersController],
  providers: [ClubOwnersService],
  exports: [ClubOwnersService],
})
export class ClubOwnersModule {}
