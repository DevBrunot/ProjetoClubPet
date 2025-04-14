import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caretaker } from '../../entities/caretaker.entity';

@Injectable()
export class CaretakersService {
  constructor(
    @InjectRepository(Caretaker)
    private caretakersRepository: Repository<Caretaker>,
  ) {}

  async create(caretaker: Caretaker): Promise<Caretaker> {
    return await this.caretakersRepository.save(caretaker);
  }

  async findAll(): Promise<Caretaker[]> {
    return await this.caretakersRepository.find({
      relations: ['pets']
    });
  }

  async findAvailable(): Promise<Caretaker[]> {
    return await this.caretakersRepository.find({
      where: { isAvailable: true },
      relations: ['pets']
    });
  }

  async findOne(id: number): Promise<Caretaker> {
    const caretaker = await this.caretakersRepository.findOne({
      where: { id },
      relations: ['pets']
    });
    if (!caretaker) {
      throw new NotFoundException(`Cuidador com ID ${id} não encontrado`);
    }
    return caretaker;
  }

  async update(id: number, caretaker: Caretaker): Promise<Caretaker> {
    await this.caretakersRepository.update(id, caretaker);
    return await this.findOne(id);
  }

  async updateAvailability(id: number, isAvailable: boolean): Promise<Caretaker> {
    await this.caretakersRepository.update(id, { isAvailable });
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.caretakersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cuidador com ID ${id} não encontrado`);
    }
  }
}