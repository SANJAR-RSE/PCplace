import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument, BookingStatus } from '../schemas/booking.schema';
import { Club, ClubDocument } from '../schemas/club.schema';
import { Review, ReviewDocument } from '../schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Club.name) private clubModel: Model<ClubDocument>,
  ) {}

  findByClub(clubId: string) {
    return this.reviewModel.find({ club: clubId }).populate('user', 'fullName').sort({ createdAt: -1 });
  }

  // Spec 5.3: faqat borib kelgan/bron qilgan foydalanuvchilar izoh qoldiradi.
  async create(userId: string, dto: CreateReviewDto) {
    const booking = await this.bookingModel.findById(dto.booking);
    if (!booking) throw new NotFoundException('Bron topilmadi');
    if (booking.user.toString() !== userId) {
      throw new ForbiddenException('Bu bron sizga tegishli emas');
    }
    if (![BookingStatus.CONFIRMED, BookingStatus.COMPLETED].includes(booking.status)) {
      throw new BadRequestException('Faqat tasdiqlangan/yakunlangan bronlar uchun izoh qoldirish mumkin');
    }

    const existing = await this.reviewModel.findOne({ user: userId, booking: dto.booking });
    if (existing) throw new ConflictException('Bu bron uchun allaqachon izoh qoldirilgan');

    let review: ReviewDocument;
    try {
      review = await this.reviewModel.create({
        user: userId,
        club: booking.club,
        booking: booking._id,
        rating: dto.rating,
        comment: dto.comment,
      });
    } catch (err: any) {
      // Parallel so'rovlar uchun himoya — pre-check o'tib ketgan bo'lsa ham, unique index xatosini to'g'ri xabar qilamiz.
      if (err?.code === 11000) {
        throw new ConflictException('Bu bron uchun allaqachon izoh qoldirilgan');
      }
      throw err;
    }

    await this.recalculateClubRating(booking.club.toString());
    return review;
  }

  private async recalculateClubRating(clubId: string) {
    const stats = await this.reviewModel.aggregate([
      { $match: { club: new Types.ObjectId(clubId) } },
      { $group: { _id: '$club', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const { avg = 0, count = 0 } = stats[0] ?? {};
    await this.clubModel.findByIdAndUpdate(clubId, { ratingAverage: Math.round(avg * 10) / 10, ratingCount: count });
  }
}
