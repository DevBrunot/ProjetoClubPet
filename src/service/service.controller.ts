import { Controller, Post, Body, Get, Put, Param, Query } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { Service } from '../entities/service.entity';
import { EndMultipleServicesDto } from './dto/end-multiple-services.dto';

@Controller('services')
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) { }

    @Post()
    create(@Body() dto: CreateServiceDto) {
        return this.serviceService.create(dto);
    }

    @Put(':id/end')
    endService(@Param('id') id: number): Promise<Service> {
        return this.serviceService.endService(id);
    }

    @Put('end-multiple')
    async endMultiple(@Body() dto: EndMultipleServicesDto) {
        return this.serviceService.endMultipleServices(dto);
    }

    @Get()
    async getServices(@Query('completed') completed: string): Promise<Service[]> {
        if (completed === undefined) {
            return this.serviceService.findAll();
        }

        const isCompleted = completed === 'true';
        return this.serviceService.findByCompletion(isCompleted);
    }

    @Get('unavailable-dates/:caretakerId')
    async getUnavailableDates(@Param('caretakerId') caretakerId: number): Promise<string[]> {
        return this.serviceService.getUnavailableDates(caretakerId);
    }
}