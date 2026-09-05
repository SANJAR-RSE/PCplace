import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type LoginCodeDocument = LoginCode & Document;

// Web saytda generatsiya qilinib, Telegram botga kiritiladigan bir martalik login kod.
@Schema({ timestamps: true })
export class LoginCode {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  used: boolean;
}

export const LoginCodeSchema = SchemaFactory.createForClass(LoginCode);
LoginCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL — muddati o'tgan kodlar avtomatik o'chadi
