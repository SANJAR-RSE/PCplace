import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private roomsService: RoomsService) {}

  @Public()
  @Get()
  findByClub(@Query('club') clubId: string) {
    return this.roomsService.findByClub(clubId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.CLUB_OWNER)
  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateRoomDto) {
    return this.roomsService.create(user.sub, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.CLUB_OWNER)
  @Patch(':id')
  update(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string, @Body() dto: UpdateRoomDto) {
    return this.roomsService.update(user.sub, id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.CLUB_OWNER)
  @Delete(':id')
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.roomsService.remove(user.sub, id);
  }
}
