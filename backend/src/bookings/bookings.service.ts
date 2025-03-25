import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async create(bookingData: Partial<Booking>): Promise<Booking> {
    // Проверка: нельзя бронировать более 3 мест
    if (bookingData.seats && bookingData.seats > 3) {
      throw new BadRequestException('Нельзя бронировать более 3 мест');
    }
    const booking = this.bookingRepository.create({
      seats: 1, // по умолчанию 1, если не указано
      status: 'active',
      ...bookingData,
    });
    return this.bookingRepository.save(booking);
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find();
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Бронирование с ID ${id} не найдено`);
    }
    return booking;
  }

  async update(id: number, updateData: Partial<Booking>): Promise<Booking> {
    await this.bookingRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.bookingRepository.delete(id);
  }
}
