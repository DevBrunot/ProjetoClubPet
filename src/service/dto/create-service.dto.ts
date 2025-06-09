import { IsISO8601, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateServiceDto {
  @IsNumber()
  caretakerId: number;

  @IsNumber()
  petId: number;

  @IsNotEmpty()
  @IsISO8601()
  serviceDate: string; // ou Date, se preferir converter depois
}