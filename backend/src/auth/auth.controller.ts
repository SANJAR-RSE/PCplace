import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { BotSecretGuard } from '../common/guards/bot-secret.guard';
import { AuthService } from './auth.service';
import { BotLoginDto } from './dto/bot-login.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Web'da tizimga kirgan User Telegram botga ulanish uchun bir martalik kod so'raydi.
  @Post('bot-code')
  generateBotCode(@CurrentUser() user: CurrentUserPayload) {
    return this.authService.generateBotCode(user.sub);
  }

  // Faqat bot server chaqiradi (x-bot-secret header bilan).
  @Public()
  @UseGuards(BotSecretGuard)
  @Post('bot-login')
  botLogin(@Body() dto: BotLoginDto) {
    return this.authService.loginWithBotCode(dto);
  }
}
