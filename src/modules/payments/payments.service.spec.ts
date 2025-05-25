import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentsService } from './payments.service';
import { Payment } from '../../entities/payment.entity';
import { NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let repository: Repository<Payment>;
  let stripe: Stripe;

  const mockPayment = {
    id: 1,
    amount: 50.00,
    currency: 'usd',
    stripePaymentId: 'pi_123456',
    status: 'pending',
    pet: { id: 1 },
    owner: { id: 1 },
    caretaker: { id: 1 },
    description: 'Passeio com o pet',
    createdAt: new Date(),
    paidAt: null,
  };

  const mockRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockStripe = {
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getRepositoryToken(Payment),
          useValue: mockRepository,
        },
        {
          provide: 'STRIPE_CLIENT',
          useValue: mockStripe,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    repository = module.get<Repository<Payment>>(getRepositoryToken(Payment));
    stripe = module.get<Stripe>('STRIPE_CLIENT');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCheckoutSession', () => {
    it('deve criar uma sessão de checkout', async () => {
      const mockSession = {
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/pay/cs_test_123',
      };

      mockStripe.checkout.sessions.create.mockResolvedValue(mockSession);
      mockRepository.save.mockResolvedValue(mockPayment);

      const result = await service.createCheckoutSession({
        userId: 1,
        caretakerId: 1,
        amount: 50,
      });

      expect(result).toEqual({ sessionId: mockSession.id });
      expect(mockStripe.checkout.sessions.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('handleWebhook', () => {
    it('deve processar um webhook de pagamento bem-sucedido', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            payment_intent: 'pi_123456',
            amount_total: 5000,
            currency: 'usd',
          },
        },
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);
      mockRepository.findOne.mockResolvedValue(mockPayment);
      mockRepository.update.mockResolvedValue({ affected: 1 });

      await service.handleWebhook('payload', 'signature');

      expect(mockRepository.update).toHaveBeenCalledWith(
        { stripePaymentId: mockEvent.data.object.payment_intent },
        {
          status: 'completed',
          paidAt: expect.any(Date),
        },
      );
    });

    it('deve lançar erro quando o pagamento não for encontrado', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            payment_intent: 'pi_123456',
            amount_total: 5000,
            currency: 'usd',
          },
        },
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.handleWebhook('payload', 'signature')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os pagamentos', async () => {
      const mockPayments = [mockPayment];
      mockRepository.find.mockResolvedValue(mockPayments);

      const result = await service.findAll();

      expect(result).toEqual(mockPayments);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um pagamento específico', async () => {
      mockRepository.findOne.mockResolvedValue(mockPayment);

      const result = await service.findOne(1);

      expect(result).toEqual(mockPayment);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['pet', 'owner', 'caretaker'],
      });
    });

    it('deve lançar NotFoundException quando o pagamento não for encontrado', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
}); 