import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from 'src/entities/service.entity';
import { Caretaker } from 'src/entities/caretaker.entity';
import { Pet } from 'src/entities/pet.entity';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,
    @InjectRepository(Caretaker)
    private caretakerRepo: Repository<Caretaker>,
    @InjectRepository(Pet)
    private petRepo: Repository<Pet>,
  ) {}

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
}