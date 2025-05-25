import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PetsService } from './pets.service';
import { Pet } from '../../entities/pet.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PetOwner } from '../../entities/pet-owner.entity';
import { Caretaker } from '../../entities/caretaker.entity';

describe('PetsService', () => {
  let service: PetsService;
  let mockPetRepository;
  let mockPetOwnerRepository;
  let mockCaretakerRepository;

  const mockPet = {
    id: 1,
    name: 'Rex',
    species: 'Cachorro',
    breed: 'Labrador',
    age: 3,
    weight: 25.5,
    gender: 'macho',
    medicalHistory: 'Vacinado em 01/2024',
    observations: 'Alérgico a ração com milho',
    owner: { id: 1 },
    caretaker: { id: 1 },
  };

  const mockOwner = {
    id: 1,
    name: 'João Silva',
    email: 'joao@email.com',
  };

  const mockCaretaker = {
    id: 1,
    name: 'Maria Santos',
    email: 'maria@email.com',
  };

  beforeEach(async () => {
    mockPetRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockPetOwnerRepository = {
      findOne: jest.fn().mockResolvedValue(mockOwner),
    };

    mockCaretakerRepository = {
      findOne: jest.fn().mockResolvedValue(mockCaretaker),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetsService,
        {
          provide: getRepositoryToken(Pet),
          useValue: mockPetRepository,
        },
        {
          provide: getRepositoryToken(PetOwner),
          useValue: mockPetOwnerRepository,
        },
        {
          provide: getRepositoryToken(Caretaker),
          useValue: mockCaretakerRepository,
        },
      ],
    }).compile();

    service = module.get<PetsService>(PetsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um novo pet', async () => {
      mockPetRepository.save.mockResolvedValue(mockPet);

      const result = await service.create(mockPet as Pet);

      expect(result).toEqual(mockPet);
      expect(mockPetRepository.save).toHaveBeenCalledWith(mockPet);
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os pets', async () => {
      const mockPets = [mockPet];
      mockPetRepository.find.mockResolvedValue(mockPets);

      const result = await service.findAll();

      expect(result).toEqual(mockPets);
      expect(mockPetRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um pet específico', async () => {
      mockPetRepository.findOne.mockResolvedValue(mockPet);

      const result = await service.findOne(1);

      expect(result).toEqual(mockPet);
      expect(mockPetRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['owner', 'caretaker'],
      });
    });

    it('deve lançar NotFoundException quando o pet não for encontrado', async () => {
      mockPetRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByOwner', () => {
    it('deve retornar todos os pets de um dono específico', async () => {
      const mockPets = [mockPet];
      mockPetRepository.find.mockResolvedValue(mockPets);

      const result = await service.findByOwner(1);

      expect(result).toEqual(mockPets);
      expect(mockPetRepository.find).toHaveBeenCalledWith({
        where: { owner: { id: 1 } },
        relations: ['owner', 'caretaker'],
      });
    });
  });

  describe('findByCaretaker', () => {
    it('deve retornar todos os pets de um cuidador específico', async () => {
      const mockPets = [mockPet];
      mockPetRepository.find.mockResolvedValue(mockPets);

      const result = await service.findByCaretaker(1);

      expect(result).toEqual(mockPets);
      expect(mockPetRepository.find).toHaveBeenCalledWith({
        where: { caretaker: { id: 1 } },
        relations: ['owner', 'caretaker'],
      });
    });
  });

  describe('update', () => {
    it('deve atualizar um pet existente', async () => {
      const updatedPet = { ...mockPet, name: 'Rex Atualizado' };
      mockPetRepository.findOne.mockResolvedValue(updatedPet);

      const result = await service.update(1, updatedPet as Pet);

      expect(result).toEqual(updatedPet);
      expect(mockPetRepository.update).toHaveBeenCalledWith(1, updatedPet);
    });
  });

  describe('remove', () => {
    it('deve remover um pet existente', async () => {
      mockPetRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockPetRepository.delete).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException quando tentar remover um pet inexistente', async () => {
      mockPetRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
}); 