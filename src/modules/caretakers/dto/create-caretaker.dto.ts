import { IsNotEmpty, IsString, IsEmail, MinLength, IsBoolean, IsOptional } from 'class-validator';

export class CreateCaretakerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  logradouro: string;

  @IsNotEmpty()
  @IsString()
  numero: string;

  @IsNotEmpty()
  @IsString()
  bairro: string;

  @IsNotEmpty()
  @IsString()
  cidade: string;

  @IsNotEmpty()
  @IsString()
  estado: string;

  @IsNotEmpty()
  @IsString()
  cep: string;

  @IsNotEmpty()
  @IsString()
  specialization: string;

  @IsNotEmpty()
  @IsString()
  certifications: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
} 