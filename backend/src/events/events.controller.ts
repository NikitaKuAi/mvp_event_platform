// backend/src/events/events.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './event.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(@Body() eventData: Partial<Event>): Promise<Event> {
    return this.eventsService.create(eventData);
  }

  @Get()
  async findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Event> {
    return this.eventsService.findOne(Number(id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Event>): Promise<Event> {
    return this.eventsService.update(Number(id), updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.eventsService.remove(Number(id));
    return { message: 'Мероприятие удалено' };
  }
}
