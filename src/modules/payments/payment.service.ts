import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../entities/payment.entity';
import { Pet } from '../../entities/pet.entity';
import { PetOwner } from '../../entities/pet-owner.entity';
import { Caretaker } from '../../entities/caretaker.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { NotFoundException } from '@nestjs/common';
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


  async createCheckoutSession(createPaymentDto: CreatePaymentDto) {
    const { userId, caretakerId, amount } = createPaymentDto;

    const caretaker = await this.caretakerRepository.findOne({
      where: { id: caretakerId },
    });

    if (!caretaker) {
      throw new NotFoundException('Cuidador não encontrado');
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `Serviço de ${caretaker.name}`,
            },
            unit_amount: Math.round(amount * 100), // em centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:8080/p/PagamentoConfirmado',
      cancel_url: 'http://localhost:8080/p/Servicos',
      metadata: {
        userId: userId.toString(),
        caretakerId: caretakerId.toString(),
      },
    });

    if (!session.url) {
      throw new BadRequestException('URL de checkout não gerada pelo Stripe');
    }

    return {
      sessionId: session.id,
      checkoutUrl: session.url
    };
  }

  async verifyCheckoutSession(sessionId: string): Promise<'paid' | 'unpaid' | 'not_found'> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      if (!session) return 'not_found';
      if (session.payment_status === 'paid') return 'paid';
      return 'unpaid';
    } catch (error) {
      return 'not_found';
    }
  }
}
