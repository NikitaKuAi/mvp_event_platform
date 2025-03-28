import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async create(eventData: Partial<Event>): Promise<Event> {
    const event = this.eventRepository.create(eventData);
    return this.eventRepository.save(event);
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find({ where: { deletedAt: IsNull() } });
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id, deletedAt: IsNull() } });
    if (!event) {
      throw new NotFoundException(`Мероприятие с ID ${id} не найдено`);
    }
    return event;
  }

  async findByOrganizer(organizerId: number): Promise<Event[]> {
    return this.eventRepository.find({ where: { organizerId, deletedAt: IsNull() } });
  }

  async update(id: number, updateData: Partial<Event>): Promise<Event> {
    await this.eventRepository.update(id, updateData);
    return this.findOne(id);
  }

  async softDelete(id: number): Promise<Event> {
    const event = await this.findOne(id);
    event.deletedAt = new Date();
    return this.eventRepository.save(event);
  }

  async restore(id: number): Promise<Event> {
    // Находим мероприятие, включая удалённое
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Мероприятие с ID ${id} не найдено`);
    }
    event.deletedAt = null;
    return this.eventRepository.save(event);
  }

  async remove(id: number): Promise<void> {
    await this.eventRepository.delete(id);
  }

  // Метод публикации мероприятия: проверяет, что текущий организатор является владельцем
  async publish(id: number, currentOrganizerId: number): Promise<Event> {
    const event = await this.findOne(id);
    if (event.organizerId !== currentOrganizerId) {
      throw new ForbiddenException('Вы можете публиковать только свои мероприятия');
    }
    event.status = 'published';
    return this.eventRepository.save(event);
  }
}
