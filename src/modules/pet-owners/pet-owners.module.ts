import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetOwner } from '../../entities/pet-owner.entity';

import { PetOwnersService } from './pet-owners.service';
import { PetOwnersController } from './pet-owners.controller';


@Module({
  imports: [TypeOrmModule.forFeature([PetOwner])],
  controllers: [PetOwnersController],
  providers: [PetOwnersService],
})
export class PetOwnersModule {} 