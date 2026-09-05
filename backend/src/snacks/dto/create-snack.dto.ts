import { IsMongoId, IsNumber, IsString, Min } from 'class-validator';

export class CreateSnackDto {
  @IsMongoId()
  club: string;

  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;
}
