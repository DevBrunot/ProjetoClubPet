import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateLocationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  timestamp?: Date;

  @IsOptional()
  @IsString()
  address?: string;
} 