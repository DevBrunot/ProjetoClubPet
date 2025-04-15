"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeolocationService = void 0;
// src/geolocation/geolocation.service.ts
const common_1 = require("@nestjs/common");
let GeolocationService = class GeolocationService {
    constructor() {
        // Armazenamento temporário para localização do usuário (exemplo)
        this.locationStore = {};
        // Lista simulada de treinadores com coordenadas em Brasília
        this.trainers = [
            { id: 't1', name: 'Treinador Brasília A', latitude: -15.8000, longitude: -47.8800 },
            { id: 't2', name: 'Treinador Brasília B', latitude: -15.7950, longitude: -47.8850 },
            { id: 't3', name: 'Treinador Brasília C', latitude: -15.7900, longitude: -47.8900 },
        ];
    }
    async updateLocation(dto) {
        dto.timestamp = dto.timestamp || new Date();
        this.locationStore[dto.userId] = dto;
    }
    async getLocation(userId) {
        const location = this.locationStore[userId];
        if (!location) {
            throw new common_1.NotFoundException('Localização não encontrada para o usuário.');
        }
        return location;
    }
    // Retorna a lista de treinadores (simulada, agora com dados de Brasília)
    async getAllTrainers() {
        return this.trainers;
    }
    // Encontra o treinador mais próximo usando a fórmula de Haversine
    async findNearestTrainer(dto) {
        const { latitude, longitude } = dto;
        let nearestTrainer = null;
        let minDistance = Infinity;
        for (const trainer of this.trainers) {
            const distance = this.calculateDistance(latitude, longitude, trainer.latitude, trainer.longitude);
            if (distance < minDistance) {
                minDistance = distance;
                nearestTrainer = trainer;
            }
        }
        if (!nearestTrainer) {
            throw new common_1.NotFoundException('Nenhum treinador encontrado');
        }
        return { trainer: nearestTrainer, distance: minDistance };
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Raio da Terra em km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * (Math.PI / 180)) *
                Math.cos(lat2 * (Math.PI / 180)) *
                Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
};
GeolocationService = __decorate([
    (0, common_1.Injectable)()
], GeolocationService);
exports.GeolocationService = GeolocationService;
//# sourceMappingURL=geolocation.service.js.map