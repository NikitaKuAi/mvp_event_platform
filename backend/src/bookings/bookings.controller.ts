import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.entity';

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

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.bookingsService.remove(Number(id));
    return { message: 'Бронирование удалено' };
  }
}
