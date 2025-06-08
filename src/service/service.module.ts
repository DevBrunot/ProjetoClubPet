import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../entities/service.entity';
import { Caretaker } from '../entities/caretaker.entity';
import { Pet } from '../entities/pet.entity';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Caretaker, Pet])], // <-- IMPORTANTE!
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}