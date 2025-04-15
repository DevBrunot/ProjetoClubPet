"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeolocationController = void 0;
// src/geolocation/geolocation.controller.ts
const common_1 = require("@nestjs/common");
const geolocation_service_1 = require("./geolocation.service");
const service_request_dto_1 = require("./dto/service-request.dto");
let GeolocationController = class GeolocationController {
    constructor(geoService) {
        this.geoService = geoService;
    }
    async ping(dto) {
        return { message: 'Localização atualizada com sucesso.' };
    }
    async requestService(dto) {
        return this.geoService.findNearestTrainer(dto);
    }
    // Rota para renderizar a página do mapa
    renderMap() {
        return { googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY };
    }
    // Rota para obter dados (para um usuário, por exemplo)
    async getLocation(userId) {
        return { userId };
    }
    // NOVO endpoint para obter todas as localizações dos treinadores
    async getAllTrainers() {
        return this.geoService.getAllTrainers();
    }
};
__decorate([
    (0, common_1.Post)('ping'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GeolocationController.prototype, "ping", null);
__decorate([
    (0, common_1.Post)('request'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [service_request_dto_1.ServiceRequestDto]),
    __metadata("design:returntype", Promise)
], GeolocationController.prototype, "requestService", null);
__decorate([
    (0, common_1.Get)('map'),
    (0, common_1.Render)('geolocation') // Procura o template views/geolocation.ejs
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GeolocationController.prototype, "renderMap", null);
__decorate([
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GeolocationController.prototype, "getLocation", null);
__decorate([
    (0, common_1.Get)('trainers/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GeolocationController.prototype, "getAllTrainers", null);
GeolocationController = __decorate([
    (0, common_1.Controller)('geolocation'),
    __metadata("design:paramtypes", [geolocation_service_1.GeolocationService])
], GeolocationController);
exports.GeolocationController = GeolocationController;
//# sourceMappingURL=geolocation.controller.js.map