import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../entities/payment.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2023-10-16',
      },
    );
  }

  async createCheckoutSession(
    userId: number,
    caretakerId: number,
    amount: number,
  ) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${this.configService.get<string>('FRONTEND_URL')}/success`,
      cancel_url: `${this.configService.get<string>('FRONTEND_URL')}/cancel`,
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Serviço de Cuidador de Pets',
            },
            unit_amount: amount * 100, // Stripe trabalha com centavos
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        caretakerId,
      },
    });

    const payment = this.paymentRepository.create({
      user: { id: userId },
      caretaker: { id: caretakerId },
      amount,
      currency: 'brl',
      stripePaymentIntentId: session.id,
      status: 'pending',
    });

    await this.paymentRepository.save(payment);

    return { sessionId: session.id };
  }

  async handleWebhook(event: Stripe.Event) {
    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === 'checkout.session.completed') {
      await this.paymentRepository.update(
        { stripePaymentIntentId: session.id },
        { status: 'completed' },
      );
    } else if (event.type === 'checkout.session.expired') {
      await this.paymentRepository.update(
        { stripePaymentIntentId: session.id },
        { status: 'failed' },
      );
    }
  }
}
