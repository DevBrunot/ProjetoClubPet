import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PetOwner } from './pet-owner.entity';
import { Caretaker } from './caretaker.entity';
import { Pet } from './pet.entity';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PetOwner, { nullable: false })
  @JoinColumn({ name: 'pet_owner_id' })
  petOwner: PetOwner;

  @Column({ name: 'pet_owner_id' })
  petOwnerId: number;

  @ManyToOne(() => Caretaker, { nullable: false })
  @JoinColumn({ name: 'caretaker_id' })
  caretaker: Caretaker;

  @Column({ name: 'caretaker_id' })
  caretakerId: number;

  @ManyToOne(() => Pet, { nullable: true })
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @Column({ name: 'pet_id', nullable: true })
  petId: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ name: 'start_time' })
  startTime: string;

  @Column({ name: 'end_time' })
  endTime: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 