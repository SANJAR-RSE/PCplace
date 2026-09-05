import { IsEnum } from 'class-validator';
import { ClubStatus } from '../../schemas/club.schema';

export class UpdateClubStatusDto {
  @IsEnum(ClubStatus)
  status: ClubStatus;
}
