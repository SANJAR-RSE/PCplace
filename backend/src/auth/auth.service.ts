import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Role } from '../common/enums/role.enum';
import { Admin, AdminDocument } from '../schemas/admin.schema';
import { ClubOwner, ClubOwnerDocument } from '../schemas/club-owner.schema';
import { LoginCode, LoginCodeDocument } from '../schemas/login-code.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { BotLoginDto } from './dto/bot-login.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(ClubOwner.name) private clubOwnerModel: Model<ClubOwnerDocument>,
    @InjectModel(LoginCode.name) private loginCodeModel: Model<LoginCodeDocument>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  private sign(payload: { sub: string; role: Role; email: string }) {
    return this.jwtService.sign(payload);
  }

  // Faqat User ro'yxatdan o'tishi mumkin (spec 4-bo'lim: Admin/ClubOwner faqat login qiladi).
  async register(dto: RegisterDto) {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) {
      throw new ConflictException('Bu email allaqachon ro‘yxatdan o‘tgan');
    }
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.userModel.create({
      fullName: dto.fullName,
      email: dto.email,
      passwordHash,
      phone: dto.phone,
    });
    const accessToken = this.sign({ sub: user.id, role: Role.USER, email: user.email });
    return { accessToken, user: this.sanitizeUser(user) };
  }

  // Bitta login endpoint — User, Admin, ClubOwner kolleksiyalarini navbat bilan tekshiradi.
  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email }).select('+passwordHash');
    if (user) {
      await this.verifyPassword(dto.password, user.passwordHash);
      const accessToken = this.sign({ sub: user.id, role: Role.USER, email: user.email });
      return { accessToken, user: this.sanitizeUser(user) };
    }

    const owner = await this.clubOwnerModel.findOne({ email: dto.email }).select('+passwordHash');
    if (owner) {
      await this.verifyPassword(dto.password, owner.passwordHash);
      const accessToken = this.sign({ sub: owner.id, role: Role.CLUB_OWNER, email: owner.email });
      return { accessToken, user: this.sanitizeUser(owner) };
    }

    const admin = await this.adminModel.findOne({ email: dto.email }).select('+passwordHash');
    if (admin) {
      await this.verifyPassword(dto.password, admin.passwordHash);
      const accessToken = this.sign({ sub: admin.id, role: Role.ADMIN, email: admin.email });
      return { accessToken, user: this.sanitizeUser(admin) };
    }

    throw new UnauthorizedException('Email yoki parol noto‘g‘ri');
  }

  private async verifyPassword(plain: string, hash: string) {
    const matches = await bcrypt.compare(plain, hash);
    if (!matches) {
      throw new UnauthorizedException('Email yoki parol noto‘g‘ri');
    }
  }

  private sanitizeUser(doc: any) {
    const obj = doc.toObject ? doc.toObject() : doc;
    delete obj.passwordHash;
    return obj;
  }

  // Web sessiyasidagi User uchun bot-login kod generatsiya qiladi.
  async generateBotCode(userId: string) {
    const ttlMinutes = Number(this.config.get('LOGIN_CODE_TTL_MINUTES') ?? 10);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    await this.loginCodeModel.create({ user: userId, code, expiresAt, used: false });

    return { code, expiresInMinutes: ttlMinutes };
  }

  // Bot serveridan chaqiriladi (x-bot-secret bilan himoyalangan): kodni tekshiradi, telegramId'ni bog'laydi.
  async loginWithBotCode(dto: BotLoginDto) {
    const entry = await this.loginCodeModel.findOne({ code: dto.code, used: false }).sort({ createdAt: -1 });
    if (!entry || entry.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Kod noto‘g‘ri yoki muddati o‘tgan');
    }

    entry.used = true;
    await entry.save();

    const user = await this.userModel.findByIdAndUpdate(
      entry.user,
      { telegramId: dto.telegramId },
      { new: true },
    );
    if (!user) {
      throw new BadRequestException('Foydalanuvchi topilmadi');
    }

    const accessToken = this.sign({ sub: user.id, role: Role.USER, email: user.email });
    return { accessToken, user: this.sanitizeUser(user) };
  }
}
