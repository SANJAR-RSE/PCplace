import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateBookingDto) {
    return this.bookingsService.create(user.sub, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @Get('mine')
  findMine(@CurrentUser() user: CurrentUserPayload) {
    return this.bookingsService.findMine(user.sub);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.CLUB_OWNER)
  @Get('incoming')
  findIncoming(@CurrentUser() user: CurrentUserPayload) {
    return this.bookingsService.findByOwner(user.sub);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.CLUB_OWNER)
  @Patch(':id/confirm')
  confirm(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.bookingsService.confirm(user.sub, id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.CLUB_OWNER)
  @Patch(':id/complete')
  complete(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.bookingsService.complete(user.sub, id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @Patch(':id/cancel')
  cancelByUser(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.bookingsService.cancel(user.sub, 'user', id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.CLUB_OWNER)
  @Patch(':id/cancel-by-owner')
  cancelByOwner(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.bookingsService.cancel(user.sub, 'owner', id);
  }
}
