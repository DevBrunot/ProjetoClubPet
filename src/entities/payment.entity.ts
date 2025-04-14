import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Caretaker } from './caretaker.entity';
import { User } from './user.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.payments, { nullable: false })
  user: User;

  @ManyToOne(() => Caretaker, (caretaker) => caretaker.payments, {
    nullable: false,
  })
  caretaker: Caretaker;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 50 })
  currency: string;

  @Column({ type: 'varchar', length: 255 })
  stripePaymentIntentId: string; // ID do pagamento no Stripe

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string; // pending, completed, failed, refunded

  @CreateDateColumn()
  createdAt: Date;
}
