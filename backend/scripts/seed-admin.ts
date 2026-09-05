/**
 * Birinchi Admin akkauntini yaratish uchun bir martalik skript.
 * Adminlar o'zi ro'yxatdan o'ta olmaydi (spec 4-bo'lim), shuning uchun tizimga
 * kiradigan birinchi admin shu skript orqali yaratiladi.
 *
 * Ishlatish: npm run seed:admin -- --email=admin@pcplace.uz --password=SuperSecret123 --name="Bosh admin"
 */
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { AdminSchema } from '../src/schemas/admin.schema';

function parseArgs() {
  const args = process.argv.slice(2);
  const result: Record<string, string> = {};
  for (const arg of args) {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) result[match[1]] = match[2];
  }
  return result;
}

async function main() {
  const { email, password, name } = parseArgs();
  if (!email || !password) {
    console.error('Xato: --email va --password majburiy. Masalan:');
    console.error('  npm run seed:admin -- --email=admin@pcplace.uz --password=SuperSecret123 --name="Bosh admin"');
    process.exit(1);
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('Xato: MONGO_URI .env faylida topilmadi');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  const AdminModel = mongoose.model('Admin', AdminSchema);

  const existing = await AdminModel.findOne({ email });
  if (existing) {
    console.log(`Admin allaqachon mavjud: ${email}`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await AdminModel.create({ fullName: name ?? 'Admin', email, passwordHash });

  console.log(`Admin yaratildi: ${email}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
