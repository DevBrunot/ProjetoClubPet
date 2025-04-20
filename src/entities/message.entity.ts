import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { PetOwner } from './pet-owner.entity';
import { Caretaker } from './caretaker.entity';
import { Pet } from './pet.entity';

export enum UserType {
  PET_OWNER = 'pet_owner',
  CARETAKER = 'caretaker',
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => PetOwner, { nullable: true })
  @JoinColumn({ name: 'pet_owner_id' })
  petOwner: PetOwner;
  
  @ManyToOne(() => Caretaker, { nullable: true })
  @JoinColumn({ name: 'caretaker_id' })
  caretaker: Caretaker;

  @ManyToOne(() => Pet, { nullable: true })
  @JoinColumn({ name: 'pet_id' })
  pet: Pet;

  @Column({
    type: 'enum',
    enum: UserType,
    nullable: false,
  })
  senderType: UserType;

  @Column({ nullable: false })
  conversationId: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}