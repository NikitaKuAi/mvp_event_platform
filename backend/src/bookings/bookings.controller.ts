import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@Body() bookingData: Partial<Booking>): Promise<Booking> {
    return this.bookingsService.create(bookingData);
  }

  @Get()
  async findAll(): Promise<Booking[]> {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Booking> {
    return this.bookingsService.findOne(Number(id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Booking>): Promise<Booking> {
    return this.bookingsService.update(Number(id), updateData);
  }

  // Новый эндпоинт для отмены бронирования
  @Patch(':id/cancel')
  async cancel(@Param('id') id: string): Promise<Booking> {
    return this.bookingsService.cancel(Number(id));
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.bookingsService.remove(Number(id));
    return { message: 'Бронирование удалено' };
  }

  // Эндпоинт для получения бронирований текущего пользователя
  @UseGuards(JwtAuthGuard)
  @Get('my')
  async getMyBookings(@Req() req): Promise<Booking[]> {
    return this.bookingsService.findByUser(req.user.id);
  }
}
