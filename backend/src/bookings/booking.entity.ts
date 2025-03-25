// backend/src/bookings/booking.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type BookingStatus = 'active' | 'cancelled' | 'paid';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  eventId: number;

  @Column({ default: 1 })
  seats: number;

  @Column({ type: 'varchar', default: 'active' })
  status: BookingStatus;

  @CreateDateColumn()
  createdAt: Date;
}
