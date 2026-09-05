import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Schema({ _id: false })
export class BookingSnackItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Snack', required: true })
  snack: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  unitPrice: number; // buyurtma paytidagi narx (keyinchalik snack narxi o'zgarsa ham tarix saqlanadi)
}

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  user: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Club', required: true, index: true })
  club: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Room', required: true })
  room: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pc', required: true })
  pc: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  hours: number;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ type: [BookingSnackItem], default: [] })
  snacks: BookingSnackItem[];

  @Prop({ required: true, min: 0 })
  roomCost: number;

  @Prop({ required: true, min: 0 })
  snacksCost: number;

  @Prop({ required: true, min: 0 })
  totalPrice: number;

  @Prop({ type: String, enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
