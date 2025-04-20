import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Pet } from './pet.entity';
import { PetOwner } from './pet-owner.entity';
import { Caretaker } from './caretaker.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column({ nullable: true })
  stripePaymentId: string;

  @Column({ default: 'pending' })
  status: string;

  @ManyToOne(() => Pet, { nullable: false })
  pet: Pet;

  @ManyToOne(() => PetOwner, { nullable: false })
  owner: PetOwner;

  @ManyToOne(() => Caretaker, { nullable: true })
  caretaker: Caretaker;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;
}
