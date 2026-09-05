import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PlanType } from '../common/enums/plan.enum';
import { stripSensitiveFields } from '../common/utils/strip-sensitive';

export type ClubOwnerDocument = ClubOwner & Document;

// Klub egalari ham admin tomonidan yaratiladi/tasdiqlanadi — faqat login qiladi (registratsiya yo'q).
@Schema({ timestamps: true })
export class ClubOwner {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ type: String, enum: PlanType, default: PlanType.FREE })
  plan: PlanType;

  @Prop({ default: true })
  isActive: boolean;
}

export const ClubOwnerSchema = SchemaFactory.createForClass(ClubOwner);
stripSensitiveFields(ClubOwnerSchema);
