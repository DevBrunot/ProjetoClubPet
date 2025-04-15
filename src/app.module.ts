// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GeolocationModule } from './geolocation/geolocation.module';
// Se você já tem um AppController ou outros módulos, importe-os também.
// import { AppController } from './app.controller'; 

@Module({
  imports: [
    // Carrega as variáveis do arquivo .env e as torna disponíveis globalmente
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Inclua o módulo que você criou para geolocalização
    GeolocationModule,
    // Adicione outros módulos que você possa ter
  ],
  controllers: [
    // Caso tenha um AppController, liste-o aqui
    // AppController
  ],
  providers: [],
})
export class AppModule {}
