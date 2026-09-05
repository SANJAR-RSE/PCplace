import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreatePcDto } from './dto/create-pc.dto';
import { UpdatePcDto } from './dto/update-pc.dto';
import { PcsService } from './pcs.service';

@Controller('pcs')
export class PcsController {
  constructor(private pcsService: PcsService) {}

  @Public()
  @Get()
  findByRoom(@Query('room') roomId: string) {
    return this.pcsService.findByRoom(roomId);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.CLUB_OWNER)
  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreatePcDto) {
    return this.pcsService.create(user.sub, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.CLUB_OWNER)
  @Patch(':id')
  update(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string, @Body() dto: UpdatePcDto) {
    return this.pcsService.update(user.sub, id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.CLUB_OWNER)
  @Delete(':id')
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.pcsService.remove(user.sub, id);
  }
}
