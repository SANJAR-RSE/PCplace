import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ClubDocument = Club & Document;

export enum ClubStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  BLOCKED = 'blocked',
}

@Schema({ timestamps: true })
export class Club {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ type: { lat: Number, lng: Number, _id: false }, required: true })
  location: { lat: number; lng: number };

  @Prop()
  imageUrl?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ClubOwner', required: true, index: true })
  owner: Types.ObjectId;

  @Prop({ type: String, enum: ClubStatus, default: ClubStatus.PENDING })
  status: ClubStatus;

  // Boostlangan (promo) klublar xarita/qidiruvda yuqorida chiqadi — Max tarif imkoniyati.
  @Prop({ default: false })
  isPromoted: boolean;

  @Prop({ default: 0 })
  ratingAverage: number;

  @Prop({ default: 0 })
  ratingCount: number;
}

export const ClubSchema = SchemaFactory.createForClass(Club);
