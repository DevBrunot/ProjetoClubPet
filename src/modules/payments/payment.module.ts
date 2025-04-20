import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Payment } from '../../entities/payment.entity';
import { Pet } from '../../entities/pet.entity';
import { PetOwner } from '../../entities/pet-owner.entity';
import { Caretaker } from '../../entities/caretaker.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Pet, PetOwner, Caretaker]),
    ConfigModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
