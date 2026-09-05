import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type RoomDocument = Room & Document;

export enum RoomType {
  VIP = 'vip',
  STANDARD = 'umumiy',
}

@Schema({ timestamps: true })
export class Room {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Club', required: true, index: true })
  club: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: String, enum: RoomType, required: true })
  type: RoomType;

  @Prop({ required: true, min: 0 })
  pricePerHour: number;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
