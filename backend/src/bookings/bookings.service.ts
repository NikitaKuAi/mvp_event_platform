import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Booking, BookingStatus } from './booking.entity';
import { EventsService } from '../events/events.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly eventsService: EventsService,
  ) {}

  async create(bookingData: Partial<Booking>): Promise<Booking> {
    // Проверка наличия eventId
    if (bookingData.eventId === undefined) {
      throw new BadRequestException('EventId is required');
    }

    // Получаем мероприятие по eventId
    const event = await this.eventsService.findOne(Number(bookingData.eventId));
    if (!event) {
      throw new NotFoundException('Мероприятие не найдено');
    }

    // Проверяем, что мероприятие не удалено
    if (event.deletedAt) {
      throw new BadRequestException('Нельзя бронировать удалённое мероприятие');
    }

    // Проверяем, что бронирование не превышает 3 места на одного пользователя
    if (bookingData.seats && bookingData.seats > 3) {
      throw new BadRequestException('Нельзя бронировать более 3 мест на одного пользователя');
    }

    // Получаем все активные бронирования для данного мероприятия
    const currentBookings = await this.bookingRepository.find({
      where: { 
        eventId: bookingData.eventId, 
        status: 'active' 
      },
    });
    const totalBookedSeats = currentBookings.reduce((sum, booking) => sum + booking.seats, 0);

    // Проверяем, что общее количество мест не превышает вместимость мероприятия
    if (totalBookedSeats + (bookingData.seats || 1) > event.capacity!) {
      throw new BadRequestException('Превышено количество доступных мест для данного мероприятия');
    }

    // Создаем бронирование (по умолчанию seats = 1, если не указано)
    const booking = this.bookingRepository.create({
      seats: bookingData.seats || 1,
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

  async findByUser(userId: number): Promise<Booking[]> {
    return this.bookingRepository.find({ where: { userId } });
  }  

  async update(id: number, updateData: Partial<Booking>): Promise<Booking> {
    await this.bookingRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.bookingRepository.delete(id);
  }

  // Новый метод для отмены бронирования (cancel)
  async cancel(id: number): Promise<Booking> {
    const booking = await this.findOne(id);
    if (booking.status !== 'active') {
      throw new BadRequestException('Бронирование уже отменено или оплачено');
    }
    booking.status = 'cancelled';
    return this.bookingRepository.save(booking);
  }
}
