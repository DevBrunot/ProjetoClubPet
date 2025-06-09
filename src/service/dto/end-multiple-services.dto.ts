import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class EndMultipleServicesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  serviceIds: number[];
}