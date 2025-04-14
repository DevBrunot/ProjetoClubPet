import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetOwner } from '../../entities/pet-owner.entity';
import { PetOwnersController } from './pet-owners.controller';
import { PetOwnersService } from './pet-owners.service';

@Module({
  imports: [TypeOrmModule.forFeature([PetOwner])],
  controllers: [PetOwnersController],
  providers: [PetOwnersService],
})
export class PetOwnersModule {} 