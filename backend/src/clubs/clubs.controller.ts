import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { ClubsService } from './clubs.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { UpdateClubStatusDto } from './dto/update-club-status.dto';

@Controller('clubs')
export class ClubsController {
  constructor(private clubsService: ClubsService) {}

  @Public()
  @Get()
  findAll() {
    return this.clubsService.findAllApproved();
  }

  @UseGuards(RolesGuard)
  @Roles(Role.CLUB_OWNER)
  @Get('mine')
  findMine(@CurrentUser() user: CurrentUserPayload) {
    return this.clubsService.findByOwner(user.sub);
  }

  // Admin panelida moderatsiya uchun — statusidan qat'iy nazar barcha klublar.
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('all')
  findAllForAdmin() {
    return this.clubsService.findAllForAdmin();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clubsService.findById(id);
  }

  // Klub egasi o'ziniki uchun (status: pending) yaratadi; admin istalgan egaga
  // bog'lab, darhol tasdiqlangan holatda yaratishi mumkin (dto.owner orqali).
  @UseGuards(RolesGuard)
  @Roles(Role.CLUB_OWNER, Role.ADMIN)
  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateClubDto) {
    if (user.role === Role.ADMIN) {
      return this.clubsService.createAsAdmin(dto);
    }
    return this.clubsService.create(user.sub, dto);
  }

  // Klub egasi faqat o'zinikini tahrirlaydi; admin istalgan klubni tahrirlashi mumkin.
  @UseGuards(RolesGuard)
  @Roles(Role.CLUB_OWNER, Role.ADMIN)
  @Patch(':id')
  updateOwn(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string, @Body() dto: UpdateClubDto) {
    if (user.role === Role.ADMIN) {
      return this.clubsService.updateAsAdmin(id, dto);
    }
    return this.clubsService.updateOwn(user.sub, id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateClubStatusDto) {
    return this.clubsService.updateStatus(id, dto);
  }
}
