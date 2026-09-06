import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Club, ClubDocument } from '../schemas/club.schema';
import { Room, RoomDocument } from '../schemas/room.schema';
import { Role } from '../common/enums/role.enum';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(Club.name) private clubModel: Model<ClubDocument>,
  ) {}

  findByClub(clubId: string) {
    return this.roomModel.find({ club: clubId });
  }

  async findById(id: string) {
    const room = await this.roomModel.findById(id);
    if (!room) throw new NotFoundException('Xona topilmadi');
    return room;
  }

  private async assertOwnsClub(ownerId: string, clubId: string) {
    const club = await this.clubModel.findById(clubId);
    if (!club) throw new NotFoundException('Kompyuterhona topilmadi');
    if (club.owner.toString() !== ownerId) {
      throw new ForbiddenException('Bu klub sizga tegishli emas');
    }
  }

  async create(ownerId: string, role: string, dto: CreateRoomDto) {
    if (role !== Role.ADMIN) {
      await this.assertOwnsClub(ownerId, dto.club);
    }
    return this.roomModel.create(dto);
  }

  async update(ownerId: string, role: string, roomId: string, dto: UpdateRoomDto) {
    const room = await this.findById(roomId);
    if (role !== Role.ADMIN) {
      await this.assertOwnsClub(ownerId, room.club.toString());
    }
    Object.assign(room, dto);
    return room.save();
  }

  async remove(ownerId: string, role: string, roomId: string) {
    const room = await this.findById(roomId);
    if (role !== Role.ADMIN) {
      await this.assertOwnsClub(ownerId, room.club.toString());
    }
    await room.deleteOne();
    return { deleted: true };
  }
}
