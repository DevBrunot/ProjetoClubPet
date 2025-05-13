import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpException, Render } from '@nestjs/common';

import { Caretaker } from '../../entities/caretaker.entity';
import { CaretakersService } from './caretakers.service';

@Controller('caretakers')
export class CaretakersController {
  constructor(private readonly caretakersService: CaretakersService) {}

  @Post()
  async create(@Body() caretaker: Caretaker): Promise<Caretaker> {
    try {
      return await this.caretakersService.create(caretaker);
    } catch (error) {
      throw new HttpException('Erro ao criar cuidador', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<Caretaker[]> {
    return await this.caretakersService.findAll();
  }

  @Get('available')
  async findAvailable(): Promise<Caretaker[]> {
    return await this.caretakersService.findAvailable();
  }

  @Get('perfil/:id')
  @Render('caretaker-profile')
  async renderProfile(@Param('id') id: number) {
    const caretaker = await this.caretakersService.findOne(id);
    if (caretaker) caretaker.password = '';
    return { caretaker };
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Caretaker> {
    const caretaker = await this.caretakersService.findOne(id);
    if (!caretaker) {
      throw new HttpException('Cuidador não encontrado', HttpStatus.NOT_FOUND);
    }
    return caretaker;
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() caretaker: Caretaker): Promise<Caretaker> {
    try {
      return await this.caretakersService.update(id, caretaker);
    } catch (error) {
      throw new HttpException('Erro ao atualizar cuidador', HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id/availability')
  async updateAvailability(@Param('id') id: number, @Body('isAvailable') isAvailable: boolean): Promise<Caretaker> {
    try {
      return await this.caretakersService.updateAvailability(id, isAvailable);
    } catch (error) {
      throw new HttpException('Erro ao atualizar disponibilidade', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    try {
      await this.caretakersService.remove(id);
    } catch (error) {
      throw new HttpException('Erro ao remover cuidador', HttpStatus.BAD_REQUEST);
    }
  }
} 