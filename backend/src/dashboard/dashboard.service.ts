import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { EventsService } from '../events/events.service';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService,
    private readonly bookingsService: BookingsService,
  ) {}

  // Dashboard для организатора
  async getOrganizerDashboard(organizerId: number, email: string) {
    const profile = await this.usersService.findByEmail(email);
    if (!profile) {
      throw new NotFoundException('Организатор не найден');
    }
    // Получаем мероприятия, созданные организатором
    const events = await this.eventsService.findByOrganizer(organizerId);
    // Для каждого мероприятия собираем бронирования и суммарное число забронированных мест
    const eventsWithStats = await Promise.all(
      events.map(async (event) => {
        const bookings = await this.bookingsService.findAllByEvent(event.id);
        const totalSeatsBooked = bookings.reduce((sum, b) => sum + b.seats, 0);
        return { ...event, bookings, totalSeatsBooked };
      })
    );
    return { profile, events: eventsWithStats };
  }

  // Dashboard для обычного пользователя
  async getUserDashboard(userId: number, email: string) {
    const profile = await this.usersService.findByEmail(email);
    if (!profile) {
      throw new NotFoundException('Пользователь не найден');
    }
    // Получаем бронирования, сделанные пользователем
    const bookings = await this.bookingsService.findByUser(userId);
    return { profile, bookings };
  }
}
