import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PetOwner } from './pet-owner.entity';
import { Caretaker } from './caretaker.entity';

@Entity()
export class Pet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  species: string;

  @Column()
  breed: string;

  @Column()
  age: number;

  @Column()
  weight: number;

  @Column({ type: 'text', nullable: true })
  medicalHistory: string;

  @ManyToOne(() => PetOwner, owner => owner.pets)
  owner: PetOwner;

  @ManyToOne(() => Caretaker, caretaker => caretaker.pets)
  caretaker: Caretaker;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
} 