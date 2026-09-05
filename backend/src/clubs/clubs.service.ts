import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club, ClubDocument, ClubStatus } from '../schemas/club.schema';
import { ClubOwner, ClubOwnerDocument } from '../schemas/club-owner.schema';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { UpdateClubStatusDto } from './dto/update-club-status.dto';

@Injectable()
export class ClubsService {
  constructor(
    @InjectModel(Club.name) private clubModel: Model<ClubDocument>,
    @InjectModel(ClubOwner.name) private clubOwnerModel: Model<ClubOwnerDocument>,
  ) {}

  // Xarita/qidiruv uchun ochiq ro'yxat — faqat tasdiqlangan klublar, promo-lar birinchi.
  findAllApproved() {
    return this.clubModel
      .find({ status: ClubStatus.APPROVED })
      .sort({ isPromoted: -1, ratingAverage: -1 });
  }

  async findById(id: string) {
    const club = await this.clubModel.findById(id);
    if (!club) throw new NotFoundException('Kompyuterhona topilmadi');
    return club;
  }

  findByOwner(ownerId: string) {
    return this.clubModel.find({ owner: ownerId }).sort({ createdAt: -1 });
  }

  findAllForAdmin() {
    return this.clubModel.find().sort({ createdAt: -1 });
  }

  create(ownerId: string, dto: CreateClubDto) {
    return this.clubModel.create({ ...dto, owner: ownerId, status: ClubStatus.PENDING });
  }

  // Admin nomidan klub yaratish — ko'rsatilgan klub egasiga bog'lanadi va darhol tasdiqlangan holatda ochiladi.
  async createAsAdmin(dto: CreateClubDto) {
    if (!dto.owner) {
      throw new BadRequestException('Klub egasini (owner) ko\'rsatish shart');
    }
    const owner = await this.clubOwnerModel.findById(dto.owner);
    if (!owner) {
      throw new BadRequestException('Ko\'rsatilgan klub egasi topilmadi');
    }
    return this.clubModel.create({ ...dto, owner: dto.owner, status: ClubStatus.APPROVED });
  }

  async updateOwn(ownerId: string, clubId: string, dto: UpdateClubDto) {
    const club = await this.clubModel.findById(clubId);
    if (!club) throw new NotFoundException('Kompyuterhona topilmadi');
    if (club.owner.toString() !== ownerId) {
      throw new ForbiddenException('Bu klub sizga tegishli emas');
    }
    Object.assign(club, dto);
    return club.save();
  }

  // Admin istalgan klubni (egasidan qat'iy nazar) tahrirlashi mumkin.
  async updateAsAdmin(clubId: string, dto: UpdateClubDto) {
    const club = await this.clubModel.findByIdAndUpdate(clubId, dto, { new: true });
    if (!club) throw new NotFoundException('Kompyuterhona topilmadi');
    return club;
  }

  async updateStatus(clubId: string, dto: UpdateClubStatusDto) {
    const club = await this.clubModel.findByIdAndUpdate(clubId, { status: dto.status }, { new: true });
    if (!club) throw new NotFoundException('Kompyuterhona topilmadi');
    return club;
  }

  // Subscriptions moduli Max tarif sotib olinganda chaqiradi.
  async setPromoted(clubId: string, isPromoted: boolean) {
    await this.clubModel.findByIdAndUpdate(clubId, { isPromoted });
  }

  async recalculateRating(clubId: string, newAverage: number, newCount: number) {
    await this.clubModel.findByIdAndUpdate(clubId, {
      ratingAverage: newAverage,
      ratingCount: newCount,
    });
  }
}
