import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Только организаторы могут создавать мероприятия
  @Post()
  @Roles('organizer')
  async create(@Body() eventData: Partial<Event>, @Req() req): Promise<Event> {
    console.log('User from token:', req.user);
    eventData.organizerId = req.user.id;
    return this.eventsService.create(eventData);
  }

  // Статический маршрут для организатора должен идти раньше динамического
  @Get('organizer')
  @Roles('organizer')
  async findOrganizerEvents(@Req() req): Promise<Event[]> {
    return this.eventsService.findByOrganizer(req.user.id);
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
  async update(@Param('id') id: string, @Body() updateData: Partial<Event>, @Req() req): Promise<Event> {
    return this.eventsService.update(Number(id), updateData);
  }

  @Patch(':id/soft-delete')
  async softDelete(@Param('id') id: string): Promise<Event> {
    return this.eventsService.softDelete(Number(id));
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: string): Promise<Event> {
    return this.eventsService.restore(Number(id));
  }

  @Patch(':id/publish')
  @Roles('organizer')
  async publish(@Param('id') id: string, @Req() req): Promise<Event> {
    return this.eventsService.publish(Number(id), req.user.sub);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.eventsService.remove(Number(id));
    return { message: 'Мероприятие удалено' };
  }
}
