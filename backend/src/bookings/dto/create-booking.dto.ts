import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsMongoId, IsNumber, IsOptional, Min, ValidateNested } from 'class-validator';

class BookingSnackInput {
  @IsMongoId()
  snack: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateBookingDto {
  @IsMongoId()
  pc: string;

  @IsNumber()
  @Min(1)
  hours: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => BookingSnackInput)
  snacks?: BookingSnackInput[];
}
