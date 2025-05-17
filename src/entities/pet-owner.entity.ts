import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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
  logradouro: string;

  @Column()
  numero: string;

  @Column()
  bairro: string;

  @Column()
  cidade: string;

  @Column()
  estado: string;

  @Column()
  cep: string;

  @Column({ default: false })
  blocked: boolean;

  @OneToMany(() => Pet, (pet) => pet.owner)
  pets: Pet[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
