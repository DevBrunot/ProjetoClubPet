// src/geolocation/geolocation.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ServiceRequestDto } from './dto/service-request.dto';

interface Trainer {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

@Injectable()
export class GeolocationService {
  // Armazenamento temporário para localização do usuário (exemplo)
  private locationStore: Record<string, UpdateLocationDto> = {};

  // Lista simulada de treinadores com coordenadas em Brasília
  private trainers: Trainer[] = [
    { id: 't1', name: 'Treinador Brasília A', latitude: -15.8000, longitude: -47.8800 },
    { id: 't2', name: 'Treinador Brasília B', latitude: -15.7950, longitude: -47.8850 },
    { id: 't3', name: 'Treinador Brasília C', latitude: -15.7900, longitude: -47.8900 },
  ];

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

  // Retorna a lista de treinadores (simulada, agora com dados de Brasília)
  async getAllTrainers(): Promise<Trainer[]> {
    return this.trainers;
  }

  // Encontra o treinador mais próximo usando a fórmula de Haversine
  async findNearestTrainer(dto: ServiceRequestDto) {
    const { latitude, longitude } = dto;
    let nearestTrainer: Trainer | null = null;
    let minDistance = Infinity;

    for (const trainer of this.trainers) {
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
