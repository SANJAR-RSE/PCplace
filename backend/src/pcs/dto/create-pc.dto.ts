import { IsMongoId, IsString } from 'class-validator';

export class CreatePcDto {
  @IsMongoId()
  club: string;

  @IsMongoId()
  room: string;

  @IsString()
  label: string;
}
