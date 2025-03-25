// backend/src/events/event.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column()
  location: string;

  // Хранение ссылок на фотографии в виде массива строк (через "simple-array")
  @Column('simple-array', { nullable: true })
  mediaUrls: string[];

  // ID организатора (пользователя, создавшего мероприятие)
  @Column()
  organizerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
