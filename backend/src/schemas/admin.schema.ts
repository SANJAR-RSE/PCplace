import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { stripSensitiveFields } from '../common/utils/strip-sensitive';

export type AdminDocument = Admin & Document;

// Adminlar ro'yxatdan o'tmaydi — faqat boshqa admin tomonidan yaratiladi, faqat login qiladi.
@Schema({ timestamps: true })
export class Admin {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
stripSensitiveFields(AdminSchema);
