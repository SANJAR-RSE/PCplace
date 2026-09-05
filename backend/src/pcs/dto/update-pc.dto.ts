import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PcStatus } from '../../schemas/pc.schema';

export class UpdatePcDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsEnum(PcStatus)
  status?: PcStatus;
}
