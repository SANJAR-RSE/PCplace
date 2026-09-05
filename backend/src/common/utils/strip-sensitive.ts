import { Schema } from 'mongoose';

// passwordHash hech qachon JSON javobda chiqmasligi uchun — .create()/.save() natijasi ham,
// {select:false} bilan yashirilmagan boshqa har qanday joy ham shu orqali himoyalanadi.
export function stripSensitiveFields(schema: Schema, fields: string[] = ['passwordHash']) {
  schema.set('toJSON', {
    transform: (_doc, ret) => {
      for (const field of fields) {
        delete ret[field];
      }
      return ret;
    },
  });
}
