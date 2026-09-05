import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club, ClubDocument } from '../schemas/club.schema';
import { Pc, PcDocument, PcStatus } from '../schemas/pc.schema';
import { CreatePcDto } from './dto/create-pc.dto';
import { UpdatePcDto } from './dto/update-pc.dto';

@Injectable()
export class PcsService {
  constructor(
    @InjectModel(Pc.name) private pcModel: Model<PcDocument>,
    @InjectModel(Club.name) private clubModel: Model<ClubDocument>,
  ) {}

  // Bron oqimi uchun: bitta xonadagi bo'sh/band PC'lar real-time holati bilan.
  findByRoom(roomId: string) {
    return this.pcModel.find({ room: roomId });
  }

  async findById(id: string) {
    const pc = await this.pcModel.findById(id);
    if (!pc) throw new NotFoundException('PC topilmadi');
    return pc;
  }

  private async assertOwnsClub(ownerId: string, clubId: string) {
    const club = await this.clubModel.findById(clubId);
    if (!club) throw new NotFoundException('Kompyuterhona topilmadi');
    if (club.owner.toString() !== ownerId) {
      throw new ForbiddenException('Bu klub sizga tegishli emas');
    }
  }

  async create(ownerId: string, dto: CreatePcDto) {
    await this.assertOwnsClub(ownerId, dto.club);
    return this.pcModel.create(dto);
  }

  async update(ownerId: string, pcId: string, dto: UpdatePcDto) {
    const pc = await this.findById(pcId);
    await this.assertOwnsClub(ownerId, pc.club.toString());
    Object.assign(pc, dto);
    return pc.save();
  }

  async remove(ownerId: string, pcId: string) {
    const pc = await this.findById(pcId);
    await this.assertOwnsClub(ownerId, pc.club.toString());
    await pc.deleteOne();
    return { deleted: true };
  }

  async setStatus(pcId: string, status: PcStatus) {
    await this.pcModel.findByIdAndUpdate(pcId, { status });
  }
}
