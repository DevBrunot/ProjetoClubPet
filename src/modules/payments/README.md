# Testes do Módulo de Pagamentos

Este documento descreve os testes implementados para o módulo de pagamentos do ClubPet.

## Estrutura dos Testes

Os testes estão organizados em arquivos `.spec.ts` que correspondem aos serviços e controladores:

- `payments.service.spec.ts`: Testes do serviço de pagamentos
- `payments.controller.spec.ts`: Testes do controlador de pagamentos

## Testes do Serviço de Pagamentos

### 1. createCheckoutSession

```typescript
describe('createCheckoutSession', () => {
  it('deve criar uma sessão de checkout', async () => {
    // Testa a criação de uma sessão de pagamento no Stripe
    // Verifica se o pagamento é salvo no banco
    // Confirma o retorno do ID da sessão
  });
});
```

**O que testa:**
- Criação de sessão no Stripe
- Salvamento do pagamento no banco
- Retorno correto do ID da sessão

### 2. handleWebhook

```typescript
describe('handleWebhook', () => {
  it('deve processar um webhook de pagamento bem-sucedido', async () => {
    // Testa o processamento de um webhook de pagamento completo
    // Verifica a atualização do status do pagamento
  });

  it('deve lançar erro quando o pagamento não for encontrado', async () => {
    // Testa o caso de pagamento não encontrado
    // Verifica se a exceção correta é lançada
  });
});
```

**O que testa:**
- Processamento de webhooks do Stripe
- Atualização de status de pagamentos
- Tratamento de erros

### 3. findAll

```typescript
describe('findAll', () => {
  it('deve retornar todos os pagamentos', async () => {
    // Testa a listagem de todos os pagamentos
    // Verifica se o repositório é chamado corretamente
  });
});
```

**O que testa:**
- Listagem completa de pagamentos
- Chamada correta ao repositório

### 4. findOne

```typescript
describe('findOne', () => {
  it('deve retornar um pagamento específico', async () => {
    // Testa a busca de um pagamento por ID
    // Verifica se as relações são carregadas
  });

  it('deve lançar NotFoundException quando o pagamento não for encontrado', async () => {
    // Testa o caso de pagamento não encontrado
    // Verifica se a exceção correta é lançada
  });
});
```

**O que testa:**
- Busca de pagamento por ID
- Carregamento de relações
- Tratamento de pagamento não encontrado

## Mocks Utilizados

### Mock do Repositório

```typescript
const mockRepository = {
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
};
```

### Mock do Stripe

```typescript
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
```

### Mock de Pagamento

```typescript
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
```

## Como Executar os Testes

1. Execute todos os testes:
```bash
npm test
```

2. Execute com cobertura:
```bash
npm run test:cov
```

3. Execute em modo watch:
```bash
npm run test:watch
```

## Boas Práticas Implementadas

1. **Isolamento**: Cada teste é independente e usa mocks para simular dependências
2. **Cobertura**: Testes cobrem casos de sucesso e erro
3. **Organização**: Testes agrupados por funcionalidade
4. **Limpeza**: Mocks são limpos após cada teste
5. **Assertions**: Uso de expectativas claras e específicas

## Próximos Passos

1. Adicionar testes para casos de erro do Stripe
2. Implementar testes de integração
3. Adicionar testes para validações de entrada
4. Implementar testes de performance 