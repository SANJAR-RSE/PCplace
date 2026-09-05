import { IsEnum, IsMongoId, IsNumber, IsString, Min } from 'class-validator';
import { RoomType } from '../../schemas/room.schema';

export class CreateRoomDto {
  @IsMongoId()
  club: string;

  @IsString()
  name: string;

  @IsEnum(RoomType)
  type: RoomType;

  @IsNumber()
  @Min(0)
  pricePerHour: number;
}
