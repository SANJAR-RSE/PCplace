import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from '../schemas/booking.schema';
import { Admin, AdminDocument } from '../schemas/admin.schema';
import { Club, ClubDocument } from '../schemas/club.schema';
import { ClubOwner, ClubOwnerDocument } from '../schemas/club-owner.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(ClubOwner.name) private ownerModel: Model<ClubOwnerDocument>,
    @InjectModel(Club.name) private clubModel: Model<ClubDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  findAll() {
    return this.adminModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string) {
    const admin = await this.adminModel.findById(id);
    if (!admin) throw new NotFoundException('Admin topilmadi');
    return admin;
  }

  async create(dto: CreateAdminDto) {
    const existing = await this.adminModel.findOne({ email: dto.email });
    if (existing) throw new ConflictException('Bu email band');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    return this.adminModel.create({ ...dto, passwordHash });
  }

  async update(id: string, dto: UpdateAdminDto) {
    const admin = await this.adminModel.findByIdAndUpdate(id, dto, { new: true });
    if (!admin) throw new NotFoundException('Admin topilmadi');
    return admin;
  }

  async remove(id: string) {
    const admin = await this.adminModel.findByIdAndDelete(id);
    if (!admin) throw new NotFoundException('Admin topilmadi');
    return { deleted: true };
  }

  async stats() {
    const [usersCount, ownersCount, clubsCount, bookingsCount] = await Promise.all([
      this.userModel.countDocuments(),
      this.ownerModel.countDocuments(),
      this.clubModel.countDocuments(),
      this.bookingModel.countDocuments(),
    ]);
    return { usersCount, ownersCount, clubsCount, bookingsCount };
  }
}
