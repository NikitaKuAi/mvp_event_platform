import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboard(@Req() req) {
    // Из JWT токена получаем идентификатор (sub) и email
    const userId = req.user.sub;
    const email = req.user.email;
    // Если у пользователя роль "organizer", возвращаем расширенный dashboard организатора
    if (req.user.role === 'organizer') {
      return this.dashboardService.getOrganizerDashboard(userId, email);
    } else {
      return this.dashboardService.getUserDashboard(userId, email);
    }
  }
}
