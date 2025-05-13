import { Body, Controller, Get, Param, Post, Render } from '@nestjs/common';
import { GeolocationService } from './geolocation.service';
import { ServiceRequestDto } from './dto/service-request.dto';
import { Trainer } from './types/trainer.interface';

@Controller('geolocation')
export class GeolocationController {
  constructor(private readonly geoService: GeolocationService) {}

  @Post('ping')
  async ping(@Body() dto: any): Promise<{ message: string }> {
    return { message: 'Localização atualizada com sucesso.' };
  }

  @Post('request')
  async requestService(@Body() dto: ServiceRequestDto): Promise<{ trainer: Trainer; distance: number }> {
    return this.geoService.findNearestTrainer(dto);
  }
  
  // Rota para renderizar a página do mapa principal
  @Get('/mapa')
  @Render('geolocation') // Procura o template views/geolocation.ejs
  renderMap() {
    return { googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY };
  }
  
  // Rota de acompanhamento do serviço
  @Get('/acompanhamento/:id')
  @Render('tracking')
  async renderTracking(@Param('id') id: string) {
    // Dados simulados para exibição
    return {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      service: {
        id,
        status: 'Em andamento',
        history: [
          { time: '10:00', event: 'Cuidador aceitou o serviço' },
          { time: '10:10', event: 'Cuidador a caminho' },
          { time: '10:20', event: 'Passeio iniciado' }
        ],
        owner: {
          name: 'Cliente Exemplo',
          lat: -15.7801,
          lng: -47.9292
        },
        caretaker: {
          name: 'João Silva',
          lat: -15.7820,
          lng: -47.9250
        }
      }
    };
  }
  
  // Rota para obter dados (para um usuário, por exemplo)
  @Get(':userId')
  async getLocation(@Param('userId') userId: string) {
    return { userId };
  }
  
  // NOVO endpoint para obter todas as localizações dos treinadores
  @Get('trainers/all')
  async getAllTrainers(): Promise<Trainer[]> {
    return this.geoService.getAllTrainers();
  }
} 