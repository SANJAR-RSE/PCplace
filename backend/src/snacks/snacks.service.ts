import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club, ClubDocument } from '../schemas/club.schema';
import { Snack, SnackDocument } from '../schemas/snack.schema';
import { CreateSnackDto } from './dto/create-snack.dto';
import { UpdateSnackDto } from './dto/update-snack.dto';

@Injectable()
export class SnacksService {
  constructor(
    @InjectModel(Snack.name) private snackModel: Model<SnackDocument>,
    @InjectModel(Club.name) private clubModel: Model<ClubDocument>,
  ) {}

  findByClub(clubId: string) {
    return this.snackModel.find({ club: clubId, isAvailable: true });
  }

  async findAllByClubForOwner(ownerId: string, clubId: string) {
    await this.assertOwnsClub(ownerId, clubId);
    return this.snackModel.find({ club: clubId }).sort({ createdAt: -1 });
  }

  async findById(id: string) {
    const snack = await this.snackModel.findById(id);
    if (!snack) throw new NotFoundException('Mahsulot topilmadi');
    return snack;
  }

  private async assertOwnsClub(ownerId: string, clubId: string) {
    const club = await this.clubModel.findById(clubId);
    if (!club) throw new NotFoundException('Kompyuterhona topilmadi');
    if (club.owner.toString() !== ownerId) {
      throw new ForbiddenException('Bu klub sizga tegishli emas');
    }
  }

  async create(ownerId: string, dto: CreateSnackDto) {
    await this.assertOwnsClub(ownerId, dto.club);
    return this.snackModel.create(dto);
  }

  async update(ownerId: string, snackId: string, dto: UpdateSnackDto) {
    const snack = await this.findById(snackId);
    await this.assertOwnsClub(ownerId, snack.club.toString());
    Object.assign(snack, dto);
    return snack.save();
  }

  async remove(ownerId: string, snackId: string) {
    const snack = await this.findById(snackId);
    await this.assertOwnsClub(ownerId, snack.club.toString());
    await snack.deleteOne();
    return { deleted: true };
  }
}
