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
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Res } from '@nestjs/common';
import { Response } from 'express';
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

  @Post('checkout')
  async createCheckout(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createCheckoutSession(createPaymentDto);
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

  @Get('close')
  getClosePage(@Res() res: Response) {
    res.type('html').send(`
    <!DOCTYPE html>
    <html>
      <head><title>Pagamento realizado</title></head>
      <body style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
        <h2>Pagamento confirmado!</h2>
        <p>Você pode fechar esta guia e voltar à aplicação.</p>
        <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">Fechar guia</button>
      </body>
    </html>
  `);
  }

  @Get()
  async findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.paymentService.findOne(id);
  }

  @Get('verify/:sessionId')
  async verifyPayment(@Param('sessionId') sessionId: string) {
    const status = await this.paymentService.verifyCheckoutSession(sessionId);
    return { status };
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
