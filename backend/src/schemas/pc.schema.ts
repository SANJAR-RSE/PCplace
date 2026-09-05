import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type PcDocument = Pc & Document;

export enum PcStatus {
  FREE = 'bosh',
  BOOKED = 'band',
  MAINTENANCE = 'texnik_xizmat',
}

@Schema({ timestamps: true })
export class Pc {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Club', required: true, index: true })
  club: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Room', required: true, index: true })
  room: Types.ObjectId;

  @Prop({ required: true, trim: true })
  label: string; // masalan "PC-01"

  @Prop({ type: String, enum: PcStatus, default: PcStatus.FREE })
  status: PcStatus;
}

export const PcSchema = SchemaFactory.createForClass(Pc);
