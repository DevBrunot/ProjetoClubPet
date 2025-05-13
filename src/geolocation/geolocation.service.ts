import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ServiceRequestDto } from './dto/service-request.dto';
import { Trainer } from './types/trainer.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caretaker } from '../entities/caretaker.entity';

@Injectable()
export class GeolocationService {
  constructor(
    @InjectRepository(Caretaker)
    private caretakersRepository: Repository<Caretaker>,
  ) {}

  // Armazenamento temporário para localização do usuário (exemplo)
  private locationStore: Record<string, UpdateLocationDto> = {};

  async updateLocation(dto: UpdateLocationDto): Promise<void> {
    dto.timestamp = dto.timestamp || new Date();
    this.locationStore[dto.userId] = dto;
  }

  async getLocation(userId: string): Promise<UpdateLocationDto> {
    const location = this.locationStore[userId];
    if (!location) {
      throw new NotFoundException('Localização não encontrada para o usuário.');
    }
    return location;
  }

  // Retorna a lista de treinadores do banco de dados
  async getAllTrainers(): Promise<Trainer[]> {
    try {
      const caretakers = await this.caretakersRepository.find();
      return caretakers.map(caretaker => ({
        id: caretaker.id.toString(),
        name: caretaker.name,
        latitude: -15.8323 + (Math.random() - 0.5) * 0.002, // Próximo ao UniCEUB Taguatinga
        longitude: -48.0558 + (Math.random() - 0.5) * 0.002, // Próximo ao UniCEUB Taguatinga
        position: { lat: -15.8323 + (Math.random() - 0.5) * 0.002, lng: -48.0558 + (Math.random() - 0.5) * 0.002 },
      }));
    } catch (error) {
      console.error('Erro ao buscar caretakers:', error);
      return []; // Retorna lista vazia em caso de erro
    }
  }

  // Encontra o treinador mais próximo usando a fórmula de Haversine
  async findNearestTrainer(dto: ServiceRequestDto): Promise<{ trainer: Trainer; distance: number }> {
    const { latitude, longitude } = dto;
    const trainers = await this.getAllTrainers();
    
    if (trainers.length === 0) {
      throw new NotFoundException('Nenhum treinador encontrado');
    }

    let nearestTrainer: Trainer | null = null;
    let minDistance = Infinity;

    for (const trainer of trainers) {
      const distance = this.calculateDistance(latitude, longitude, trainer.latitude, trainer.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        nearestTrainer = trainer;
      }
    }

    if (!nearestTrainer) {
      throw new NotFoundException('Nenhum treinador encontrado');
    }
    return { trainer: nearestTrainer, distance: minDistance };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
} 