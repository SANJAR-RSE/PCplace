import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../common/enums/role.enum';
import { PlanType } from '../common/enums/plan.enum';
import { stripSensitiveFields } from '../common/utils/strip-sensitive';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  passwordHash: string;

  @Prop({ trim: true })
  phone?: string;

  // Telegram bot bilan bog'langan akkaunt (bot orqali login qilingandan keyin to'ldiriladi)
  @Prop({ unique: true, sparse: true })
  telegramId?: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role: Role;

  @Prop({ type: String, enum: PlanType, default: PlanType.FREE })
  plan: PlanType;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
stripSensitiveFields(UserSchema);
