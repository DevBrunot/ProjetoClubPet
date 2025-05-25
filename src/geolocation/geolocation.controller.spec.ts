import { Test, TestingModule } from '@nestjs/testing';
import { GeolocationController } from './geolocation.controller';
import { GeolocationService } from './geolocation.service';
import { ServiceRequestDto } from './dto/service-request.dto';
import { Trainer } from './types/trainer.interface';

describe('GeolocationController', () => {
  let controller: GeolocationController;
  let service: GeolocationService;

  const mockGeolocationService = {
    findNearestTrainer: jest.fn(),
    getAllTrainers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeolocationController],
      providers: [
        {
          provide: GeolocationService,
          useValue: mockGeolocationService,
        },
      ],
    }).compile();

    controller = module.get<GeolocationController>(GeolocationController);
    service = module.get<GeolocationService>(GeolocationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ping', () => {
    it('deve retornar mensagem de sucesso', async () => {
      const result = await controller.ping({});
      expect(result).toEqual({ message: 'Localização atualizada com sucesso.' });
    });
  });

  describe('requestService', () => {
    it('deve retornar o treinador mais próximo e a distância', async () => {
      const mockRequestDto: ServiceRequestDto = {
        userId: '123',
        latitude: -15.7800,
        longitude: -47.9290,
      };

      const mockResponse = {
        trainer: {
          id: '1',
          name: 'João Silva',
          latitude: -15.7801,
          longitude: -47.9292,
          isAvailable: true,
        } as Trainer,
        distance: 0.5,
      };

      mockGeolocationService.findNearestTrainer.mockResolvedValue(mockResponse);

      const result = await controller.requestService(mockRequestDto);

      expect(result).toEqual(mockResponse);
      expect(service.findNearestTrainer).toHaveBeenCalledWith(mockRequestDto);
    });
  });

  describe('renderMap', () => {
    it('deve renderizar o mapa com a chave da API do Google Maps', () => {
      process.env.GOOGLE_MAPS_API_KEY = 'test-api-key';

      const result = controller.renderMap();

      expect(result).toEqual({ googleMapsApiKey: 'test-api-key' });
    });
  });

  describe('renderTracking', () => {
    it('deve renderizar a página de acompanhamento com dados simulados', async () => {
      const serviceId = '123';
      process.env.GOOGLE_MAPS_API_KEY = 'test-api-key';

      const result = await controller.renderTracking(serviceId);

      expect(result).toEqual({
        googleMapsApiKey: 'test-api-key',
        service: {
          id: serviceId,
          status: 'Em andamento',
          history: [
            { time: '10:00', event: 'Cuidador aceitou o serviço' },
            { time: '10:10', event: 'Cuidador a caminho' },
            { time: '10:20', event: 'Passeio iniciado' },
          ],
          owner: {
            name: 'Cliente Exemplo',
            lat: -15.7801,
            lng: -47.9292,
          },
          caretaker: {
            name: 'João Silva',
            lat: -15.7820,
            lng: -47.9250,
          },
        },
      });
    });
  });

  describe('getLocation', () => {
    it('deve retornar o ID do usuário', async () => {
      const userId = '123';
      const result = await controller.getLocation(userId);
      expect(result).toEqual({ userId });
    });
  });

  describe('getAllTrainers', () => {
    it('deve retornar todos os treinadores', async () => {
      const mockTrainers: Trainer[] = [
        {
          id: '1',
          name: 'João Silva',
          latitude: -15.7801,
          longitude: -47.9292,
          
        },
      ];

      mockGeolocationService.getAllTrainers.mockResolvedValue(mockTrainers);

      const result = await controller.getAllTrainers();

      expect(result).toEqual(mockTrainers);
      expect(service.getAllTrainers).toHaveBeenCalled();
    });
  });
}); 