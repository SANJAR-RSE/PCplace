import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Club, ClubSchema } from '../schemas/club.schema';
import { Pc, PcSchema } from '../schemas/pc.schema';
import { PcsController } from './pcs.controller';
import { PcsService } from './pcs.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pc.name, schema: PcSchema },
      { name: Club.name, schema: ClubSchema },
    ]),
  ],
  controllers: [PcsController],
  providers: [PcsService],
  exports: [PcsService],
})
export class PcsModule {}
