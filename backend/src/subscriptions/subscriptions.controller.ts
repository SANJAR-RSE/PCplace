import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { PurchaseSubscriptionDto } from './dto/purchase-subscription.dto';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.USER, Role.CLUB_OWNER)
  @Post('purchase')
  purchase(@CurrentUser() user: CurrentUserPayload, @Body() dto: PurchaseSubscriptionDto) {
    return this.subscriptionsService.purchase(user.sub, user.role as Role, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.USER, Role.CLUB_OWNER)
  @Get('mine')
  findMine(@CurrentUser() user: CurrentUserPayload) {
    return this.subscriptionsService.findMine(user.sub);
  }
}
