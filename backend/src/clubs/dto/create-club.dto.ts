import { Type } from 'class-transformer';
import { IsMongoId, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class LocationDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class CreateClubDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  // Faqat admin klub yaratganda kerak — qaysi klub egasiga tegishli ekanini bildiradi.
  @IsOptional()
  @IsMongoId()
  owner?: string;
}
