import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Message } from '../../entities/message.entity';
import { PetOwner } from '../../entities/pet-owner.entity';
import { Caretaker } from '../../entities/caretaker.entity';
import { Pet } from '../../entities/pet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, PetOwner, Caretaker, Pet]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {} 