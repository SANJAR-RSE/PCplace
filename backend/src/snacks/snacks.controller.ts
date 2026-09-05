import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateSnackDto } from './dto/create-snack.dto';
import { UpdateSnackDto } from './dto/update-snack.dto';
import { SnacksService } from './snacks.service';

@Controller('snacks')
export class SnacksController {
  constructor(private snacksService: SnacksService) {}

  @Public()
  @Get()
  findByClub(@Query('club') clubId: string) {
    return this.snacksService.findByClub(clubId);
  }

  // Egasi o'z boshqaruv panelida o'chirilgan (isAvailable: false) mahsulotlarni ham ko'rishi kerak.
  @UseGuards(RolesGuard)
  @Roles(Role.CLUB_OWNER)
  @Get('mine')
  findAllForOwner(@CurrentUser() user: CurrentUserPayload, @Query('club') clubId: string) {
    return this.snacksService.findAllByClubForOwner(user.sub, clubId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.CLUB_OWNER)
  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateSnackDto) {
    return this.snacksService.create(user.sub, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.CLUB_OWNER)
  @Patch(':id')
  update(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string, @Body() dto: UpdateSnackDto) {
    return this.snacksService.update(user.sub, id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.CLUB_OWNER)
  @Delete(':id')
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.snacksService.remove(user.sub, id);
  }
}
