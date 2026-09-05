import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { ClubOwner, ClubOwnerDocument } from '../schemas/club-owner.schema';
import { CreateClubOwnerDto } from './dto/create-club-owner.dto';
import { UpdateClubOwnerDto } from './dto/update-club-owner.dto';

@Injectable()
export class ClubOwnersService {
  constructor(@InjectModel(ClubOwner.name) private ownerModel: Model<ClubOwnerDocument>) {}

  findAll() {
    return this.ownerModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string) {
    const owner = await this.ownerModel.findById(id);
    if (!owner) throw new NotFoundException('Klub egasi topilmadi');
    return owner;
  }

  // Faqat admin yaratadi — spec 4-bo'lim: klub egasi ham faqat login qiladi, o'zi ro'yxatdan o'tmaydi.
  async create(dto: CreateClubOwnerDto) {
    const existing = await this.ownerModel.findOne({ email: dto.email });
    if (existing) throw new ConflictException('Bu email band');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    return this.ownerModel.create({ ...dto, passwordHash });
  }

  async update(id: string, dto: UpdateClubOwnerDto) {
    const owner = await this.ownerModel.findByIdAndUpdate(id, dto, { new: true });
    if (!owner) throw new NotFoundException('Klub egasi topilmadi');
    return owner;
  }

  async remove(id: string) {
    const owner = await this.ownerModel.findByIdAndDelete(id);
    if (!owner) throw new NotFoundException('Klub egasi topilmadi');
    return { deleted: true };
  }
}
