import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../entities/payment.entity';
import { Pet } from '../../entities/pet.entity';
import { PetOwner } from '../../entities/pet-owner.entity';
import { Caretaker } from '../../entities/caretaker.entity';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Pet)
    private petRepository: Repository<Pet>,
    @InjectRepository(PetOwner)
    private petOwnerRepository: Repository<PetOwner>,
    @InjectRepository(Caretaker)
    private caretakerRepository: Repository<Caretaker>,
    private configService: ConfigService,
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.warn('Stripe Secret Key não definida! Pagamentos não funcionarão corretamente.');
    }
    this.stripe = new Stripe(stripeKey || 'dummy_key_for_dev');
  }

  async createPayment(
    petId: number, 
    ownerId: number, 
    amount: number, 
    description: string,
    caretakerId?: number
  ): Promise<Payment> {
    const pet = await this.petRepository.findOne({ where: { id: petId } });
    if (!pet) {
      throw new BadRequestException(`Pet com ID ${petId} não encontrado`);
    }

    const owner = await this.petOwnerRepository.findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new BadRequestException(`Dono com ID ${ownerId} não encontrado`);
    }

    let caretaker: Caretaker | undefined = undefined;
    if (caretakerId) {
      const foundCaretaker = await this.caretakerRepository.findOne({ where: { id: caretakerId } });
      if (!foundCaretaker) {
        throw new BadRequestException(`Cuidador com ID ${caretakerId} não encontrado`);
      }
      caretaker = foundCaretaker;
    }

    try {
      const metadata: Record<string, string> = {
        petId: petId.toString(),
        ownerId: ownerId.toString(),
      };

      if (caretakerId) {
        metadata.caretakerId = caretakerId.toString();
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe trabalha com centavos
        currency: 'brl',
        description: `Pagamento para o pet ${pet.name}`,
        metadata,
      });

      const paymentData = {
        amount,
        currency: 'BRL',
        stripePaymentId: paymentIntent.id,
        status: 'pending',
        pet,
        owner,
        description,
      };

      if (caretaker) {
        Object.assign(paymentData, { caretaker });
      }

      const payment = this.paymentRepository.create(paymentData);
      return await this.paymentRepository.save(payment);
    } catch (error) {
      throw new BadRequestException(`Erro ao criar pagamento: ${error.message}`);
    }
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentRepository.find({
      relations: ['pet', 'owner', 'caretaker'],
    });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['pet', 'owner', 'caretaker'],
    });
    
    if (!payment) {
      throw new BadRequestException(`Pagamento com ID ${id} não encontrado`);
    }
    
    return payment;
  }

  async updatePaymentStatus(stripePaymentId: string, status: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { stripePaymentId },
    });

    if (!payment) {
      throw new BadRequestException(`Pagamento com ID ${stripePaymentId} não encontrado`);
    }

    payment.status = status;

    if (status === 'completed') {
      payment.paidAt = new Date();
    }

    return await this.paymentRepository.save(payment);
  }
}
