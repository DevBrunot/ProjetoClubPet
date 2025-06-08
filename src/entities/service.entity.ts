import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Caretaker } from './caretaker.entity';
import { Pet } from './pet.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Caretaker)
  caretaker: Caretaker;

  @ManyToOne(() => Pet)
  pet: Pet;

  @Column()
  caretakerName: string;

  @Column({ nullable: true, type: 'text' })
  caretakerImageUrl: string;

  @Column()
  caretakerPhone: string;

  @Column()
  caretakerSpecialization: string;

  @Column()
  caretakerLogradouro: string;

  @Column()
  petName: string;

  @Column({ nullable: true, type: 'text' })
  petImageUrl: string;

  @Column()
  petBreed: string;

  @Column()
  petAge: number;

  @Column()
  petWeight: number;

  @Column()
  petGender: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'date' })
  serviceDate: Date;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  endedAt: Date;
}