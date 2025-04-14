import { Controller, Post, Body, Req, Res, Headers } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import Stripe from 'stripe';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout')
  async createCheckoutSession(
    @Body() body: { userId: number; caretakerId: number; amount: number },
  ) {
    return this.paymentService.createCheckoutSession(
      body.userId,
      body.caretakerId,
      body.amount,
    );
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    await this.paymentService.handleWebhook(event);
    res.status(200).send('Success');
  }
}
