// src/geolocation/geolocation.controller.ts
import { Body, Controller, Get, Param, Post, Render } from '@nestjs/common';
import { GeolocationService } from './geolocation.service';
import { ServiceRequestDto } from './dto/service-request.dto';

@Controller('geolocation')
export class GeolocationController {
  constructor(private readonly geoService: GeolocationService) {}

  @Post('ping')
  async ping(@Body() dto: any): Promise<{ message: string }> {
    return { message: 'Localização atualizada com sucesso.' };
  }

  @Post('request')
  async requestService(@Body() dto: ServiceRequestDto) {
    return this.geoService.findNearestTrainer(dto);
  }
  
  // Rota para renderizar a página do mapa
  @Get('map')
  @Render('geolocation') // Procura o template views/geolocation.ejs
  renderMap() {
    return { googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY };
  }
  
  // Rota para obter dados (para um usuário, por exemplo)
  @Get(':userId')
  async getLocation(@Param('userId') userId: string) {
    return { userId };
  }
  
  // NOVO endpoint para obter todas as localizações dos treinadores
  @Get('trainers/all')
  async getAllTrainers() {
    return this.geoService.getAllTrainers();
  }
}
