import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaretakersService } from './caretakers.service';
import { Caretaker } from '../../entities/caretaker.entity';
import { NotFoundException } from '@nestjs/common';

describe('CaretakersService', () => {
  let service: CaretakersService;
  let repository: Repository<Caretaker>;

  const mockCaretaker = {
    id: 1,
    name: 'João Silva',
    email: 'joao@email.com',
    password: 'senha123',
    phone: '61999999999',
    aniversario: new Date(),
    logradouro: 'Rua Teste',
    numero: '123',
    bairro: 'Centro',
    cidade: 'Brasília',
    estado: 'DF',
    cep: '70000-000',
    specialization: 'Adestramento',
    certifications: 'Certificado em Comportamento Canino',
    description: 'Especialista em adestramento',
    isAvailable: true,
    pets: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaretakersService,
        {
          provide: getRepositoryToken(Caretaker),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CaretakersService>(CaretakersService);
    repository = module.get<Repository<Caretaker>>(getRepositoryToken(Caretaker));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um novo cuidador', async () => {
      mockRepository.save.mockResolvedValue(mockCaretaker);

      const result = await service.create(mockCaretaker as Caretaker);

      expect(result).toEqual(mockCaretaker);
      expect(mockRepository.save).toHaveBeenCalledWith(mockCaretaker);
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os cuidadores', async () => {
      const mockCaretakers = [mockCaretaker];
      mockRepository.find.mockResolvedValue(mockCaretakers);

      const result = await service.findAll();

      expect(result).toEqual(mockCaretakers);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['pets'],
      });
    });
  });

  describe('findAvailable', () => {
    it('deve retornar apenas cuidadores disponíveis', async () => {
      const mockCaretakers = [mockCaretaker];
      mockRepository.find.mockResolvedValue(mockCaretakers);

      const result = await service.findAvailable();

      expect(result).toEqual(mockCaretakers);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { isAvailable: true },
        relations: ['pets'],
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar um cuidador específico', async () => {
      mockRepository.findOne.mockResolvedValue(mockCaretaker);

      const result = await service.findOne(1);

      expect(result).toEqual(mockCaretaker);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['pets'],
      });
    });

    it('deve lançar NotFoundException quando o cuidador não for encontrado', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar um cuidador existente', async () => {
      const updatedCaretaker = { ...mockCaretaker, name: 'João Silva Atualizado' };
      mockRepository.findOne.mockResolvedValue(updatedCaretaker);

      const result = await service.update(1, updatedCaretaker as Caretaker);

      expect(result).toEqual(updatedCaretaker);
      expect(mockRepository.update).toHaveBeenCalledWith(1, updatedCaretaker);
    });
  });

  describe('updateAvailability', () => {
    it('deve atualizar a disponibilidade de um cuidador', async () => {
      const updatedCaretaker = { ...mockCaretaker, isAvailable: false };
      mockRepository.findOne.mockResolvedValue(updatedCaretaker);

      const result = await service.updateAvailability(1, false);

      expect(result).toEqual(updatedCaretaker);
      expect(mockRepository.update).toHaveBeenCalledWith(1, { isAvailable: false });
    });
  });

  describe('remove', () => {
    it('deve remover um cuidador existente', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException quando tentar remover um cuidador inexistente', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
}); 