import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { ClubOwnersService } from './club-owners.service';
import { CreateClubOwnerDto } from './dto/create-club-owner.dto';
import { UpdateClubOwnerDto } from './dto/update-club-owner.dto';

@Controller('club-owners')
export class ClubOwnersController {
  constructor(private ownersService: ClubOwnersService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.CLUB_OWNER)
  @Get('me')
  getMe(@CurrentUser() user: CurrentUserPayload) {
    return this.ownersService.findById(user.sub);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.CLUB_OWNER)
  @Patch('me')
  updateMe(@CurrentUser() user: CurrentUserPayload, @Body() dto: UpdateClubOwnerDto) {
    return this.ownersService.update(user.sub, dto);
  }

  // --- Admin CRUD ---
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.ownersService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateClubOwnerDto) {
    return this.ownersService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ownersService.findById(id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClubOwnerDto) {
    return this.ownersService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ownersService.remove(id);
  }
}
