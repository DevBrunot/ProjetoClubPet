import { Test, TestingModule } from '@nestjs/testing';
import { GeolocationService } from './geolocation.service';
import { ServiceRequestDto } from './dto/service-request.dto';
import { Trainer } from './types/trainer.interface';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Caretaker } from '../entities/caretaker.entity';

describe('GeolocationService', () => {
  let service: GeolocationService;
  let mockRepository;

  const mockTrainers: Trainer[] = [
    {
      id: '1',
      name: 'João Silva',
      latitude: -15.7801,
      longitude: -47.9292,
    },
    {
      id: '2',
      name: 'Maria Santos',
      latitude: -15.7820,
      longitude: -47.9250,
    },
  ];

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn().mockResolvedValue(mockTrainers),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeolocationService,
        {
          provide: getRepositoryToken(Caretaker),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GeolocationService>(GeolocationService);
  });

  describe('findNearestTrainer', () => {
    it('deve encontrar o treinador mais próximo', async () => {
      const requestDto: ServiceRequestDto = {
        userId: '123',
        latitude: -15.7800,
        longitude: -47.9290,
      };

      const result = await service.findNearestTrainer(requestDto);

      expect(result).toBeDefined();
      expect(result.trainer).toBeDefined();
      expect(result.distance).toBeGreaterThanOrEqual(0);
    });

    it('deve retornar erro quando não houver treinadores disponíveis', async () => {
      const requestDto: ServiceRequestDto = {
        userId: '123',
        latitude: -15.7800,
        longitude: -47.9290,
      };

      mockRepository.find.mockResolvedValueOnce([]);

      await expect(service.findNearestTrainer(requestDto)).rejects.toThrow();
    });
  });

  describe('getAllTrainers', () => {
    it('deve retornar todos os treinadores', async () => {
      const result = await service.getAllTrainers();

      expect(result).toEqual(mockTrainers);
      expect(result.length).toBe(2);
    });
  });

  describe('calculateDistance', () => {
    it('deve calcular a distância corretamente entre dois pontos', () => {
      const lat1 = -15.7801;
      const lng1 = -47.9292;
      const lat2 = -15.7820;
      const lng2 = -47.9250;

      const distance = service['calculateDistance'](lat1, lng1, lat2, lng2);

      expect(distance).toBeGreaterThan(0);
      expect(typeof distance).toBe('number');
    });

    it('deve retornar 0 para o mesmo ponto', () => {
      const lat = -15.7801;
      const lng = -47.9292;

      const distance = service['calculateDistance'](lat, lng, lat, lng);

      expect(distance).toBe(0);
    });
  });
}); 