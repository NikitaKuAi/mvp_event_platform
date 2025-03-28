import { Controller, Get, Param, NotFoundException, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Новый эндпоинт для личного кабинета текущего пользователя
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<User> {
    const user = await this.usersService.findByEmail(req.user.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Эндпоинт для получения пользователя по email (оставляем для обратной совместимости)
  @Get(':email')
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
}
