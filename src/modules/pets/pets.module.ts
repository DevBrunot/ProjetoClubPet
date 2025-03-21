import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from '../../entities/pet.entity';
import { PetOwner } from '../../entities/pet-owner.entity';
import { Caretaker } from '../../entities/caretaker.entity';
import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pet, PetOwner, Caretaker])],
  controllers: [PetsController],
  providers: [PetsService],
})
export class PetsModule {} 