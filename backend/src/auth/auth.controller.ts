import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Регистрация обычного пользователя
  @Post('register/user')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  // Регистрация организатора
  @Post('register/organizer')
  async registerOrganizer(@Body() createOrganizerDto: CreateOrganizerDto) {
    return this.authService.registerOrganizer(createOrganizerDto);
  }

  // Логин (один и тот же для всех)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }
}
