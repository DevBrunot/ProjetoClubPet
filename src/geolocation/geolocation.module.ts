import { Module } from '@nestjs/common';
import { GeolocationController } from './geolocation.controller';
import { GeolocationService } from './geolocation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caretaker } from '../entities/caretaker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Caretaker])],
  controllers: [GeolocationController],
  providers: [GeolocationService],
})
export class GeolocationModule {} 