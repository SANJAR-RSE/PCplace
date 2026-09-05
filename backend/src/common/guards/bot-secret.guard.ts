import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Faqat Telegram bot serveri chaqirishi kerak bo'lgan ichki endpointlarni himoya qiladi.
@Injectable()
export class BotSecretGuard implements CanActivate {
  constructor(private config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const secret = request.headers['x-bot-secret'];
    const expected = this.config.get<string>('BOT_INTERNAL_SECRET');

    if (!expected || secret !== expected) {
      throw new UnauthorizedException('Bot ruxsati yo‘q');
    }
    return true;
  }
}
