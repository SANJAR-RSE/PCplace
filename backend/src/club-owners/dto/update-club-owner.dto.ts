import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateClubOwnerDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
