import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { PetOwnersService } from './pet-owners.service';
import { PetOwner } from '../../entities/pet-owner.entity';

@Controller('pet-owners')
export class PetOwnersController {
  constructor(private readonly petOwnersService: PetOwnersService) {}

  @Post()
  async create(@Body() petOwner: PetOwner): Promise<PetOwner> {
    try {
      return await this.petOwnersService.create(petOwner);
    } catch (error) {
      throw new HttpException('Erro ao criar dono de pet', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<PetOwner[]> {
    return await this.petOwnersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PetOwner> {
    const petOwner = await this.petOwnersService.findOne(id);
    if (!petOwner) {
      throw new HttpException('Dono de pet não encontrado', HttpStatus.NOT_FOUND);
    }
    return petOwner;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() petOwner: PetOwner): Promise<PetOwner> {
    try {
      return await this.petOwnersService.update(id, petOwner);
    } catch (error) {
      throw new HttpException('Erro ao atualizar dono de pet', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    try {
      await this.petOwnersService.remove(id);
    } catch (error) {
      throw new HttpException('Erro ao remover dono de pet', HttpStatus.BAD_REQUEST);
    }
  }

  @Post(':id/bloquear')
  async bloquear(@Param('id') id: number) {
    return this.petOwnersService.bloquearUsuario(id);
  }
} 