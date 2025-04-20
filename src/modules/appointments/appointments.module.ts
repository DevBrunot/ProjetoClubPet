import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../../entities/appointment.entity';
import { AppointmentsService } from 'src/modules/appointments/appointments.service';
import { AppointmentsController } from 'src/modules/appointments/appointments.controller';
import { PetOwner } from '../../entities/pet-owner.entity';
import { Caretaker } from '../../entities/caretaker.entity';
import { Pet } from '../../entities/pet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, PetOwner, Caretaker, Pet]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {} 