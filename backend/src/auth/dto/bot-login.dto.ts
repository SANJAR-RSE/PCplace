import { IsString, Length } from 'class-validator';

export class BotLoginDto {
  @IsString()
  @Length(6, 6)
  code: string;

  @IsString()
  telegramId: string;
}
