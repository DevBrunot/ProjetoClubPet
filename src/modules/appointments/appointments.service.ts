import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from '../../entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PetOwner } from '../../entities/pet-owner.entity';
import { Caretaker } from '../../entities/caretaker.entity';
import { Pet } from '../../entities/pet.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(PetOwner)
    private petOwnerRepository: Repository<PetOwner>,
    @InjectRepository(Caretaker)
    private caretakerRepository: Repository<Caretaker>,
    @InjectRepository(Pet)
    private petRepository: Repository<Pet>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const { petOwnerId, caretakerId, petId } = createAppointmentDto;

    // Verificar se o dono do pet existe
    const petOwner = await this.petOwnerRepository.findOneBy({ id: petOwnerId });
    if (!petOwner) {
      throw new NotFoundException(`Dono de pet com ID ${petOwnerId} não encontrado`);
    }

   
    const caretaker = await this.caretakerRepository.findOneBy({ id: caretakerId });
    if (!caretaker) {
      throw new NotFoundException(`Cuidador com ID ${caretakerId} não encontrado`);
    }

   
    let pet: Pet | null = null;
    if (petId) {
      pet = await this.petRepository.findOneBy({ id: petId });
      if (!pet) {
        throw new NotFoundException(`Pet com ID ${petId} não encontrado`);
      }
    }

    // Criar novo agendamento
    const appointment = new Appointment();
    appointment.petOwner = petOwner;
    appointment.petOwnerId = petOwnerId;
    appointment.caretaker = caretaker;
    appointment.caretakerId = caretakerId;
    
    if (pet) {
      appointment.pet = pet;
      appointment.petId = petId || 0;
    }
    
    appointment.date = createAppointmentDto.date;
    appointment.startTime = createAppointmentDto.startTime;
    appointment.endTime = createAppointmentDto.endTime;
    appointment.description = createAppointmentDto.description;
    
    if (createAppointmentDto.status) {
      appointment.status = createAppointmentDto.status;
    }
    
    if (createAppointmentDto.notes) {
      appointment.notes = createAppointmentDto.notes;
    }

    return this.appointmentRepository.save(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['petOwner', 'caretaker', 'pet'],
    });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['petOwner', 'caretaker', 'pet'],
    });

    if (!appointment) {
      throw new NotFoundException(`Agendamento com ID ${id} não encontrado`);
    }

    return appointment;
  }

  async update(id: number, updateData: Partial<CreateAppointmentDto>): Promise<Appointment> {
    const appointment = await this.findOne(id);
    
    // Atualizar relacionamentos se necessário
    if (updateData.petOwnerId) {
      const petOwner = await this.petOwnerRepository.findOneBy({ id: updateData.petOwnerId });
      if (!petOwner) {
        throw new NotFoundException(`Dono de pet com ID ${updateData.petOwnerId} não encontrado`);
      }
      appointment.petOwner = petOwner;
      appointment.petOwnerId = updateData.petOwnerId;
    }
    
    if (updateData.caretakerId) {
      const caretaker = await this.caretakerRepository.findOneBy({ id: updateData.caretakerId });
      if (!caretaker) {
        throw new NotFoundException(`Cuidador com ID ${updateData.caretakerId} não encontrado`);
      }
      appointment.caretaker = caretaker;
      appointment.caretakerId = updateData.caretakerId;
    }
    
    if (updateData.petId !== undefined) {
      if (updateData.petId === null || updateData.petId === 0) {
        // Em vez de usar delete, criamos um novo objeto sem pet
        const appointmentData = {...appointment};
        appointmentData.pet = null as any; // Usar null como Pet (com type assertion)
        appointmentData.petId = 0;
        
        // Salvar e retornar
        return this.appointmentRepository.save(appointmentData);
      } else {
        const pet = await this.petRepository.findOneBy({ id: updateData.petId });
        if (!pet) {
          throw new NotFoundException(`Pet com ID ${updateData.petId} não encontrado`);
        }
        appointment.pet = pet;
        appointment.petId = updateData.petId;
      }
    }
    
    // Atualizar outros campos
    if (updateData.date !== undefined) appointment.date = updateData.date;
    if (updateData.startTime !== undefined) appointment.startTime = updateData.startTime;
    if (updateData.endTime !== undefined) appointment.endTime = updateData.endTime;
    if (updateData.description !== undefined) appointment.description = updateData.description;
    if (updateData.status !== undefined) appointment.status = updateData.status;
    if (updateData.notes !== undefined) appointment.notes = updateData.notes;
    
    return this.appointmentRepository.save(appointment);
  }

  async updateStatus(id: number, status: AppointmentStatus): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = status;
    return this.appointmentRepository.save(appointment);
  }

  async remove(id: number): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.remove(appointment);
  }
} 