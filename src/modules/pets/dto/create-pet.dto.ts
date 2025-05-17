import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePetDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  species: string;

  @IsNotEmpty()
  @IsString()
  breed: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  medicalHistory?: string;

  @IsOptional()
  @IsString()
  observations?: string;

  @IsNotEmpty()
  owner: { id: number };

  @IsOptional()
  caretaker?: { id: number };
} 