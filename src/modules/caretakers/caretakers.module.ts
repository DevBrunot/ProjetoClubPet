import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caretaker } from '../../entities/caretaker.entity';

import { CaretakersService } from './caretakers.service';
import { CaretakersController } from './caretakers.controller';


@Module({
  imports: [TypeOrmModule.forFeature([Caretaker])],
  controllers: [CaretakersController],
  providers: [CaretakersService],
})
export class CaretakersModule {} 