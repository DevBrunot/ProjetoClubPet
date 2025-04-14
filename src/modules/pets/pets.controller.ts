import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { PetsService } from './pets.service';
import { Pet } from '../../entities/pet.entity';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  async create(@Body() pet: Pet): Promise<Pet> {
    try {
      return await this.petsService.create(pet);
    } catch (error) {
      throw new HttpException('Erro ao criar pet', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<Pet[]> {
    return await this.petsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Pet> {
    const pet = await this.petsService.findOne(id);
    if (!pet) {
      throw new HttpException('Pet não encontrado', HttpStatus.NOT_FOUND);
    }
    return pet;
  }

  @Get('owner/:ownerId')
  async findByOwner(@Param('ownerId') ownerId: number): Promise<Pet[]> {
    return await this.petsService.findByOwner(ownerId);
  }

  @Get('caretaker/:caretakerId')
  async findByCaretaker(@Param('caretakerId') caretakerId: number): Promise<Pet[]> {
    return await this.petsService.findByCaretaker(caretakerId);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() pet: Pet): Promise<Pet> {
    try {
      return await this.petsService.update(id, pet);
    } catch (error) {
      throw new HttpException('Erro ao atualizar pet', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    try {
      await this.petsService.remove(id);
    } catch (error) {
      throw new HttpException('Erro ao remover pet', HttpStatus.BAD_REQUEST);
    }
  }
} 