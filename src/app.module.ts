import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetOwner } from './entities/pet-owner.entity';
import { Pet } from './entities/pet.entity';
import { Caretaker } from './entities/caretaker.entity';
import { PetOwnersModule } from './modules/pet-owners/pet-owners.module';
import { PetsModule } from './modules/pets/pets.module';
import { CaretakersModule } from './modules/caretakers/caretakers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const port = configService.get('DB_PORT');
        return {
          type: 'mysql',
          host: configService.get('DB_HOST') || 'localhost',
          port: port ? parseInt(port, 10) : 3306,
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [PetOwner, Pet, Caretaker],
          synchronize: configService.get('NODE_ENV') === 'development',
          logging: configService.get('NODE_ENV') === 'development',
          autoLoadEntities: true,
          charset: 'utf8mb4',
          timezone: 'Z',
          extra: {
            connectionLimit: 10,
          },
        };
      },
      inject: [ConfigService],
    }),
    PetOwnersModule,
    PetsModule,
    CaretakersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
