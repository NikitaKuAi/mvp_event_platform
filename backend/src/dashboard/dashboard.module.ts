import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { UsersModule } from '../users/users.module';
import { EventsModule } from '../events/events.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [UsersModule, EventsModule, BookingsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
