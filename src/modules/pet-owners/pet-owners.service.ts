import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PetOwner } from '../../entities/pet-owner.entity';

@Injectable()
export class PetOwnersService {
  constructor(
    @InjectRepository(PetOwner)
    private petOwnersRepository: Repository<PetOwner>,
  ) {}

  async create(petOwner: PetOwner): Promise<PetOwner> {
    return await this.petOwnersRepository.save(petOwner);
  }

  async findAll(): Promise<PetOwner[]> {
    return await this.petOwnersRepository.find();
  }

  async findOne(id: number): Promise<PetOwner> {
    const petOwner = await this.petOwnersRepository.findOne({ where: { id } });
    if (!petOwner) {
      throw new NotFoundException(`Dono de pet com ID ${id} não encontrado`);
    }
    return petOwner;
  }

  async update(id: number, petOwner: PetOwner): Promise<PetOwner> {
    await this.petOwnersRepository.update(id, petOwner);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.petOwnersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Dono de pet com ID ${id} não encontrado`);
    }
  }
} 