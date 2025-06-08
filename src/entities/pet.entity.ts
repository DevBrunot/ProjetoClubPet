import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PetOwner } from './pet-owner.entity';
import { Caretaker } from './caretaker.entity';

@Entity()
export class Pet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  imageUrl: string;

  @Column()
  name: string;

  @Column()
  species: string;

  @Column()
  breed: string;

  @Column()
  age: number;

  @Column('decimal', { precision: 5, scale: 2 })
  weight: number;

  @Column({ nullable: true })
  gender: string;

  @Column({ type: 'text', nullable: true })
  medicalHistory: string;

  @Column({ type: 'text', nullable: true })
  observations: string;

  @ManyToOne(() => PetOwner, petOwner => petOwner.pets)
  owner: PetOwner;

  @ManyToOne(() => Caretaker, caretaker => caretaker.pets)
  caretaker: Caretaker;

  @Column({ type: 'boolean', default: false })
  isAvailable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 