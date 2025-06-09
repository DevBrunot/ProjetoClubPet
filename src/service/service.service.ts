import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from 'src/entities/service.entity';
import { Caretaker } from 'src/entities/caretaker.entity';
import { Pet } from 'src/entities/pet.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { EndMultipleServicesDto } from './dto/end-multiple-services.dto';

@Injectable()
export class ServiceService {
    constructor(
        @InjectRepository(Service)
        private serviceRepo: Repository<Service>,
        @InjectRepository(Caretaker)
        private caretakerRepo: Repository<Caretaker>,
        @InjectRepository(Pet)
        private petRepo: Repository<Pet>,
    ) { }

    private parseToBrasiliaDate(input: string): Date {
        // Interpreta como data local (sem UTC)
        const [year, month, day] = input.split('-').map(Number);
        const localDate = new Date(year, month - 1, day);

        // Ajusta para manter a hora como meio-dia local (seguro contra offset negativo)
        localDate.setHours(12, 0, 0, 0);

        return localDate;
    }

    async create(dto: CreateServiceDto): Promise<Service> {
        const caretaker = await this.caretakerRepo.findOne({ where: { id: dto.caretakerId } });
        if (!caretaker) throw new NotFoundException('Cuidador não encontrado');

        const pet = await this.petRepo.findOne({ where: { id: dto.petId } });
        if (!pet) throw new NotFoundException('Pet não encontrado');

        caretaker.isAvailable = false;
        pet.isAvailable = false;

        await this.caretakerRepo.save(caretaker);
        await this.petRepo.save(pet);

        const service = this.serviceRepo.create({
            caretaker,
            pet,
            caretakerName: caretaker.name,
            caretakerImageUrl: caretaker.imageUrl,
            caretakerPhone: caretaker.phone,
            caretakerSpecialization: caretaker.specialization,
            caretakerLogradouro: caretaker.logradouro,
            petName: pet.name,
            petImageUrl: pet.imageUrl,
            petBreed: pet.breed,
            petAge: pet.age,
            petWeight: pet.weight,
            petGender: pet.gender,
            serviceDate: new Date(dto.serviceDate),
        });

        return this.serviceRepo.save(service);
    }

    async endService(id: number): Promise<Service> {
        const service = await this.serviceRepo.findOne({
            where: { id },
            relations: ['pet', 'caretaker'],
        });

        if (!service) throw new NotFoundException('Serviço não encontrado');

        service.isCompleted = true;
        service.endedAt = new Date();

        service.pet.isAvailable = true;
        service.caretaker.isAvailable = true;

        await this.petRepo.save(service.pet);
        await this.caretakerRepo.save(service.caretaker);

        return this.serviceRepo.save(service);
    }

    async findAll(): Promise<Service[]> {
        return this.serviceRepo.find({
            relations: ['caretaker', 'pet'],
            order: { createdAt: 'DESC' },
        });
    }

    async findByCompletion(isCompleted: boolean): Promise<Service[]> {
        return this.serviceRepo.find({
            where: { isCompleted },
            relations: ['caretaker', 'pet'],
            order: { endedAt: 'DESC' },
        });
    }

    async getUnavailableDates(caretakerId: number): Promise<string[]> {
        const services = await this.serviceRepo.find({
            where: {
                caretaker: { id: caretakerId },
                isCompleted: false,
            },
        });

        return services
            .filter(service => service.serviceDate)
            .map(service => new Date(service.serviceDate).toISOString());
    }

    async endMultipleServices(dto: EndMultipleServicesDto): Promise<Service[]> {
        const updatedServices: Service[] = [];

        for (const id of dto.serviceIds) {
            const service = await this.serviceRepo.findOne({
                where: { id },
                relations: ['pet', 'caretaker'],
            });

            if (!service || service.isCompleted) continue;

            service.isCompleted = true;
            service.endedAt = new Date();
            service.pet.isAvailable = true;
            service.caretaker.isAvailable = true;

            await this.petRepo.save(service.pet);
            await this.caretakerRepo.save(service.caretaker);
            updatedServices.push(await this.serviceRepo.save(service));
        }

        return updatedServices;
    }
}