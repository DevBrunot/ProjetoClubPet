import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pet } from '../../entities/pet.entity';
import { PetOwner } from '../../entities/pet-owner.entity';
import { Caretaker } from '../../entities/caretaker.entity';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private petsRepository: Repository<Pet>,
    @InjectRepository(PetOwner)
    private petOwnersRepository: Repository<PetOwner>,
    @InjectRepository(Caretaker)
    private caretakersRepository: Repository<Caretaker>,
  ) {}

  async create(pet: Pet): Promise<Pet> {
    if (pet.owner) {
      const owner = await this.petOwnersRepository.findOne({
        where: { id: pet.owner.id }
      });
      if (!owner) {
        throw new BadRequestException(`Dono com ID ${pet.owner.id} não encontrado`);
      }
    }

    if (pet.caretaker) {
      const caretaker = await this.caretakersRepository.findOne({
        where: { id: pet.caretaker.id }
      });
      if (!caretaker) {
        throw new BadRequestException(`Cuidador com ID ${pet.caretaker.id} não encontrado`);
      }
    }

    return await this.petsRepository.save(pet);
  }

  async findAll(): Promise<Pet[]> {
    return await this.petsRepository.find({
      relations: ['owner', 'caretaker']
    });
  }

  async findOne(id: number): Promise<Pet> {
    const pet = await this.petsRepository.findOne({
      where: { id },
      relations: ['owner', 'caretaker']
    });
    if (!pet) {
      throw new NotFoundException(`Pet com ID ${id} não encontrado`);
    }
    return pet;
  }

  async findByOwner(ownerId: number): Promise<Pet[]> {
    const owner = await this.petOwnersRepository.findOne({
      where: { id: ownerId }
    });
    if (!owner) {
      throw new NotFoundException(`Dono com ID ${ownerId} não encontrado`);
    }

    return await this.petsRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['owner', 'caretaker']
    });
  }

  async findByCaretaker(caretakerId: number): Promise<Pet[]> {
    const caretaker = await this.caretakersRepository.findOne({
      where: { id: caretakerId }
    });
    if (!caretaker) {
      throw new NotFoundException(`Cuidador com ID ${caretakerId} não encontrado`);
    }

    return await this.petsRepository.find({
      where: { caretaker: { id: caretakerId } },
      relations: ['owner', 'caretaker']
    });
  }

  async update(id: number, pet: Pet): Promise<Pet> {
    const existingPet = await this.findOne(id);

    if (pet.owner && pet.owner.id !== existingPet.owner?.id) {
      const owner = await this.petOwnersRepository.findOne({
        where: { id: pet.owner.id }
      });
      if (!owner) {
        throw new BadRequestException(`Dono com ID ${pet.owner.id} não encontrado`);
      }
    }

    if (pet.caretaker && pet.caretaker.id !== existingPet.caretaker?.id) {
      const caretaker = await this.caretakersRepository.findOne({
        where: { id: pet.caretaker.id }
      });
      if (!caretaker) {
        throw new BadRequestException(`Cuidador com ID ${pet.caretaker.id} não encontrado`);
      }
    }

    await this.petsRepository.update(id, pet);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.petsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Pet com ID ${id} não encontrado`);
    }
  }
} 