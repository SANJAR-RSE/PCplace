import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument, BookingStatus } from '../schemas/booking.schema';
import { Club, ClubDocument } from '../schemas/club.schema';
import { Pc, PcDocument, PcStatus } from '../schemas/pc.schema';
import { Room, RoomDocument } from '../schemas/room.schema';
import { Snack, SnackDocument } from '../schemas/snack.schema';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Pc.name) private pcModel: Model<PcDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(Snack.name) private snackModel: Model<SnackDocument>,
    @InjectModel(Club.name) private clubModel: Model<ClubDocument>,
  ) {}

  // Spec 5.2: PC + soat + snacklar -> umumiy narx = xona narxi (soat bo'yicha) + snacklar summasi.
  async create(userId: string, dto: CreateBookingDto) {
    const pc = await this.pcModel.findById(dto.pc);
    if (!pc) throw new NotFoundException('PC topilmadi');
    if (pc.status !== PcStatus.FREE) {
      throw new BadRequestException('Bu PC hozir band');
    }

    const room = await this.roomModel.findById(pc.room);
    if (!room) throw new NotFoundException('Xona topilmadi');

    const roomCost = room.pricePerHour * dto.hours;

    let snacksCost = 0;
    const snackItems: { snack: any; quantity: number; unitPrice: number }[] = [];
    for (const item of dto.snacks ?? []) {
      const snack = await this.snackModel.findOne({ _id: item.snack, club: pc.club, isAvailable: true });
      if (!snack) throw new BadRequestException('Tanlangan mahsulot mavjud emas');
      snacksCost += snack.price * item.quantity;
      snackItems.push({ snack: snack._id, quantity: item.quantity, unitPrice: snack.price });
    }

    const totalPrice = roomCost + snacksCost;

    const booking = await this.bookingModel.create({
      user: userId,
      club: pc.club,
      room: room._id,
      pc: pc._id,
      hours: dto.hours,
      startTime: new Date(),
      snacks: snackItems,
      roomCost,
      snacksCost,
      totalPrice,
      status: BookingStatus.PENDING,
    });

    pc.status = PcStatus.BOOKED;
    await pc.save();

    return booking;
  }

  findMine(userId: string) {
    return this.bookingModel.find({ user: userId }).sort({ createdAt: -1 });
  }

  async findById(id: string) {
    const booking = await this.bookingModel.findById(id);
    if (!booking) throw new NotFoundException('Bron topilmadi');
    return booking;
  }

  // Klub egasiga kelgan bronlar (o'ziniki klub(lar)i bo'yicha).
  async findByOwner(ownerId: string) {
    const clubs = await this.clubModel.find({ owner: ownerId }).select('_id');
    const clubIds = clubs.map((c) => c._id);
    return this.bookingModel.find({ club: { $in: clubIds } }).sort({ createdAt: -1 });
  }

  private async assertOwnerControlsBooking(ownerId: string, booking: BookingDocument) {
    const club = await this.clubModel.findById(booking.club);
    if (!club || club.owner.toString() !== ownerId) {
      throw new ForbiddenException('Bu bron sizga tegishli klubga tegishli emas');
    }
  }

  async confirm(ownerId: string, bookingId: string) {
    const booking = await this.findById(bookingId);
    await this.assertOwnerControlsBooking(ownerId, booking);
    booking.status = BookingStatus.CONFIRMED;
    return booking.save();
  }

  async complete(ownerId: string, bookingId: string) {
    const booking = await this.findById(bookingId);
    await this.assertOwnerControlsBooking(ownerId, booking);
    booking.status = BookingStatus.COMPLETED;
    await booking.save();
    await this.pcModel.findByIdAndUpdate(booking.pc, { status: PcStatus.FREE });
    return booking;
  }

  // Foydalanuvchi o'zi yoki klub egasi bekor qilishi mumkin.
  async cancel(requesterId: string, requesterRole: 'user' | 'owner', bookingId: string) {
    const booking = await this.findById(bookingId);
    if (requesterRole === 'user' && booking.user.toString() !== requesterId) {
      throw new ForbiddenException('Bu bron sizga tegishli emas');
    }
    if (requesterRole === 'owner') {
      await this.assertOwnerControlsBooking(requesterId, booking);
    }
    booking.status = BookingStatus.CANCELLED;
    await booking.save();
    await this.pcModel.findByIdAndUpdate(booking.pc, { status: PcStatus.FREE });
    return booking;
  }
}
