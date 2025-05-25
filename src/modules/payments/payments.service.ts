import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../entities/payment.entity';
import Stripe from 'stripe';

/**
 * Serviço responsável por gerenciar pagamentos usando Stripe
 */
@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @Inject('STRIPE_CLIENT')
    private stripe: Stripe,
  ) {}

  /**
   * Cria uma sessão de checkout no Stripe e registra o pagamento
   * @param data Dados do pagamento (userId, caretakerId, amount)
   * @returns ID da sessão de checkout
   */
  async createCheckoutSession(data: { userId: number; caretakerId: number; amount: number }) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Serviço de Pet',
          },
          unit_amount: data.amount * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    await this.paymentsRepository.save({
      amount: data.amount,
      currency: 'usd',
      status: 'pending',
      stripePaymentId: session.payment_intent as string,
      pet: { id: 1 }, // ID temporário, ajuste conforme necessário
      owner: { id: data.userId },
      caretaker: { id: data.caretakerId },
    } as Payment);

    return { sessionId: session.id };
  }

  /**
   * Processa webhooks do Stripe para atualizar status de pagamentos
   * @param payload Payload do webhook
   * @param signature Assinatura do webhook
   */
  async handleWebhook(payload: string, signature: string) {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || '',
    );

    if (event.type === 'checkout.session.completed') {
      const paymentIntent = event.data.object.payment_intent;
      if (typeof paymentIntent !== 'string') {
        throw new Error('Payment intent inválido');
      }

      const payment = await this.paymentsRepository.findOne({
        where: { stripePaymentId: paymentIntent },
      });

      if (!payment) {
        throw new NotFoundException('Pagamento não encontrado');
      }

      await this.paymentsRepository.update(
        { stripePaymentId: paymentIntent },
        {
          status: 'completed',
          paidAt: new Date(),
        },
      );
    }
  }

  /**
   * Retorna todos os pagamentos
   * @returns Lista de pagamentos
   */
  async findAll(): Promise<Payment[]> {
    return this.paymentsRepository.find();
  }

  /**
   * Busca um pagamento específico por ID
   * @param id ID do pagamento
   * @returns Dados do pagamento
   * @throws NotFoundException se o pagamento não for encontrado
   */
  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['pet', 'owner', 'caretaker'],
    });

    if (!payment) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    return payment;
  }
} 