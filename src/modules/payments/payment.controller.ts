import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from './payment.service';
import Stripe from 'stripe';

@Controller('payments')
export class PaymentController {
  private stripe: Stripe;

  constructor(
    private paymentService: PaymentService,
    private configService: ConfigService,
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      console.warn('Stripe Secret Key não definida! Pagamentos não funcionarão corretamente.');
    }
    this.stripe = new Stripe(stripeKey || 'dummy_key_for_dev');
  }

  @Post()
  async createPayment(
    @Body() body: { petId: number; ownerId: number; amount: number; description: string; caretakerId?: number },
  ) {
    return this.paymentService.createPayment(
      body.petId,
      body.ownerId,
      body.amount,
      body.description,
      body.caretakerId
    );
  }

  @Get()
  async findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.paymentService.findOne(id);
  }

  @Post('webhook')
  async webhook(@Body() payload: any, @Param('signature') signature: string) {
    try {
      const stripeWebhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
      if (!stripeWebhookSecret) {
        throw new BadRequestException('Stripe Webhook Secret não configurado');
      }

      const event = this.stripe.webhooks.constructEvent(
        JSON.stringify(payload),
        signature,
        stripeWebhookSecret,
      );

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.paymentService.updatePaymentStatus(paymentIntent.id, 'completed');
      } else if (event.type === 'payment_intent.payment_failed') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.paymentService.updatePaymentStatus(paymentIntent.id, 'failed');
      }

      return { received: true };
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }
}
