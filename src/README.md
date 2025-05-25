# Testes do ClubPet

Este documento descreve a estrutura e implementação dos testes do ClubPet.

## Estrutura dos Testes

Os testes estão organizados por módulos, seguindo a estrutura do projeto:

```
src/
├── modules/
│   ├── payments/
│   │   ├── payments.service.spec.ts
│   │   └── payments.controller.spec.ts
│   ├── pet-owners/
│   │   ├── pet-owners.service.spec.ts
│   │   └── pet-owners.controller.spec.ts
│   ├── caretakers/
│   │   ├── caretakers.service.spec.ts
│   │   └── caretakers.controller.spec.ts
│   └── pets/
│       ├── pets.service.spec.ts
│       └── pets.controller.spec.ts
└── geolocation/
    ├── geolocation.service.spec.ts
    └── geolocation.controller.spec.ts
```

## Módulos Testados

### 1. Pagamentos (Payments)

**Testes do Serviço:**
- `createCheckoutSession`: Criação de sessão de pagamento no Stripe
- `handleWebhook`: Processamento de webhooks do Stripe
- `findAll`: Listagem de pagamentos
- `findOne`: Busca de pagamento específico

**Mocks:**
- Repositório de pagamentos
- Cliente Stripe
- Dados de pagamento

### 2. Donos de Pet (PetOwners)

**Testes do Serviço:**
- `create`: Criação de novo dono de pet
- `findAll`: Listagem de donos
- `findOne`: Busca de dono específico
- `update`: Atualização de dados
- `remove`: Remoção de dono

**Mocks:**
- Repositório de donos
- Dados de dono de pet

### 3. Cuidadores (Caretakers)

**Testes do Serviço:**
- `create`: Criação de novo cuidador
- `findAll`: Listagem de cuidadores
- `findAvailable`: Listagem de cuidadores disponíveis
- `findOne`: Busca de cuidador específico
- `update`: Atualização de dados
- `updateAvailability`: Atualização de disponibilidade
- `remove`: Remoção de cuidador

**Mocks:**
- Repositório de cuidadores
- Dados de cuidador

### 4. Pets

**Testes do Serviço:**
- `create`: Criação de novo pet
- `findAll`: Listagem de pets
- `findOne`: Busca de pet específico
- `findByOwner`: Busca de pets por dono
- `findByCaretaker`: Busca de pets por cuidador
- `update`: Atualização de dados
- `remove`: Remoção de pet

**Mocks:**
- Repositório de pets
- Dados de pet

### 5. Geolocalização

**Testes do Serviço:**
- `findNearestTrainer`: Busca de treinador mais próximo
- `getAllTrainers`: Listagem de treinadores
- `calculateDistance`: Cálculo de distância

**Testes do Controller:**
- `ping`: Atualização de localização
- `requestService`: Solicitação de serviço
- `renderMap`: Renderização do mapa
- `renderTracking`: Acompanhamento de serviço
- `getLocation`: Obtenção de localização
- `getAllTrainers`: Listagem de treinadores

**Mocks:**
- Serviço de geolocalização
- Dados de treinador
- Dados de localização

## Executando os Testes

### Comandos Disponíveis

1. Executar todos os testes:
```bash
npm test
```

2. Executar com cobertura:
```bash
npm run test:cov
```

3. Executar em modo watch:
```bash
npm run test:watch
```

4. Executar testes específicos:
```bash
npm test -- payments.service.spec.ts
```

### Cobertura de Testes

Para verificar a cobertura de testes:
```bash
npm run test:cov
```

O relatório será gerado em `coverage/`.

## Boas Práticas

1. **Organização**
   - Testes agrupados por funcionalidade
   - Nomes descritivos para testes
   - Uso de `describe` e `it` para estruturação

2. **Isolamento**
   - Mocks para dependências externas
   - Limpeza de mocks após cada teste
   - Testes independentes

3. **Cobertura**
   - Testes de casos de sucesso
   - Testes de casos de erro
   - Validação de exceções

4. **Manutenção**
   - Código de teste limpo e legível
   - Documentação clara
   - Reutilização de mocks

## Próximos Passos

1. **Testes de Integração**
   - Testar fluxos completos
   - Integração com banco de dados
   - Testes de API

2. **Testes E2E**
   - Fluxos de usuário completos
   - Testes de interface
   - Cenários reais

3. **Melhorias**
   - Aumentar cobertura de testes
   - Adicionar testes de performance
   - Implementar testes de segurança

4. **Automação**
   - Integração com CI/CD
   - Relatórios automáticos
   - Monitoramento de cobertura 