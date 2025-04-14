import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Pet } from './pet.entity';
import { Payment } from './payment.entity';

@Entity()
export class PetOwner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Payment, (payment) => payment.pet.owner)
  payments: Payment[];

  @Column()
  phone: string;

  @Column()
  address: string;

  @OneToMany(() => Pet, (pet) => pet.owner)
  pets: Pet[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
