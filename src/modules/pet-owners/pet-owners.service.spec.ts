import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { PetOwnersService } from './pet-owners.service';
import { PetOwner } from '../../entities/pet-owner.entity';
import { NotFoundException } from '@nestjs/common';

describe('PetOwnersService', () => {
  let service: PetOwnersService;
  let mockRepository: Partial<Repository<PetOwner>>;

  const mockPetOwner = {
    id: 1,
    name: 'João Silva',
    email: 'joao@email.com',
    password: 'senha123',
    phone: '61999999999',
    aniversario: new Date(),
    logradouro: 'Rua 1',
    numero: '123',
    bairro: 'Centro',
    cidade: 'Brasília',
    estado: 'DF',
    cep: '70000000',
    blocked: false,
    pets: [],
    payments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetOwnersService,
        {
          provide: getRepositoryToken(PetOwner),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PetOwnersService>(PetOwnersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um novo dono de pet', async () => {
      (mockRepository.save as jest.Mock).mockResolvedValue(mockPetOwner);

      const result = await service.create(mockPetOwner as PetOwner);

      expect(result).toEqual(mockPetOwner);
      expect(mockRepository.save).toHaveBeenCalledWith(mockPetOwner);
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os donos de pet', async () => {
      const mockPetOwners = [mockPetOwner];
      (mockRepository.find as jest.Mock).mockResolvedValue(mockPetOwners);

      const result = await service.findAll();

      expect(result).toEqual(mockPetOwners);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um dono de pet específico', async () => {
      (mockRepository.findOne as jest.Mock).mockResolvedValue(mockPetOwner);

      const result = await service.findOne(1);

      expect(result).toEqual(mockPetOwner);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['pets', 'payments'],
      });
    });

    it('deve lançar NotFoundException quando o dono de pet não for encontrado', async () => {
      (mockRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar um dono de pet existente', async () => {
      const updatedPetOwner = { ...mockPetOwner, name: 'João Silva Atualizado' };
      (mockRepository.findOne as jest.Mock).mockResolvedValue(updatedPetOwner);

      const result = await service.update(1, updatedPetOwner as PetOwner);

      expect(result).toEqual(updatedPetOwner);
      expect(mockRepository.update).toHaveBeenCalledWith(1, updatedPetOwner);
    });
  });

  describe('remove', () => {
    it('deve remover um dono de pet existente', async () => {
      const deleteResult: DeleteResult = { affected: 1, raw: [] };
      (mockRepository.delete as jest.Mock).mockResolvedValue(deleteResult);

      await service.remove(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException quando tentar remover um dono de pet inexistente', async () => {
      const deleteResult: DeleteResult = { affected: 0, raw: [] };
      (mockRepository.delete as jest.Mock).mockResolvedValue(deleteResult);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
}); 