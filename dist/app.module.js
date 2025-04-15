"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
// src/app.module.ts
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const geolocation_module_1 = require("./geolocation/geolocation.module");
// Se você já tem um AppController ou outros módulos, importe-os também.
// import { AppController } from './app.controller'; 
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            // Carrega as variáveis do arquivo .env e as torna disponíveis globalmente
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            // Inclua o módulo que você criou para geolocalização
            geolocation_module_1.GeolocationModule,
            // Adicione outros módulos que você possa ter
        ],
        controllers: [
        // Caso tenha um AppController, liste-o aqui
        // AppController
        ],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map