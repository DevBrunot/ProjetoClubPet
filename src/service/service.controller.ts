import { Controller, Post, Body, Get, Put, Param, Query } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { Service } from '../entities/service.entity';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  create(@Body() dto: CreateServiceDto) {
    return this.serviceService.create(dto);
  }

  @Put(':id/end')
  endService(@Param('id') id: number): Promise<Service> {
    return this.serviceService.endService(id);
  }

  @Get()
  async getServices(@Query('completed') completed: string): Promise<Service[]> {
    if (completed === undefined) {
      return this.serviceService.findAll();
    }

    const isCompleted = completed === 'true';
    return this.serviceService.findByCompletion(isCompleted);
  }
}