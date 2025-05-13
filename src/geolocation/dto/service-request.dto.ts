import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ServiceRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
} 