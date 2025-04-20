import { IsNotEmpty, IsString, IsEnum, IsOptional, IsInt, IsDateString } from 'class-validator';
import { AppointmentStatus } from '../../../entities/appointment.entity';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsInt()
  petOwnerId: number;

  @IsNotEmpty()
  @IsInt()
  caretakerId: number;

  @IsOptional()
  @IsInt()
  petId?: number;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  notes?: string;
} 