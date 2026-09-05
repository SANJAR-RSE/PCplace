import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type SnackDocument = Snack & Document;

@Schema({ timestamps: true })
export class Snack {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Club', required: true, index: true })
  club: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string; // masalan "Lays", "Cola"

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ default: true })
  isAvailable: boolean;
}

export const SnackSchema = SchemaFactory.createForClass(Snack);
