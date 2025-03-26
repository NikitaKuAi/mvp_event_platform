import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateOrganizerDto } from './dto/create-organizer.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Регистрация обычного пользователя
  async registerUser(createUserDto: CreateUserDto) {
    const userExists = await this.usersService.findByEmail(createUserDto.email);
    if (userExists) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.usersService.create({
      ...createUserDto,
      passwordHash: hashedPassword,
      role: 'user',
    });
    return this.login(newUser);
  }

  // Регистрация организатора
  async registerOrganizer(createOrganizerDto: CreateOrganizerDto) {
    const userExists = await this.usersService.findByEmail(createOrganizerDto.email);
    if (userExists) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }
    const hashedPassword = await bcrypt.hash(createOrganizerDto.password, 10);
    const newOrganizer = await this.usersService.create({
      ...createOrganizerDto,
      passwordHash: hashedPassword,
      role: 'organizer',
    });
    return this.login(newOrganizer);
  }
}
