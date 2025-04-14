<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# ClubPet API

Sistema de gerenciamento para pets, seus donos e cuidadores.

## 🚀 Tecnologias

- NestJS
- TypeORM
- MariaDB
- Docker
- TypeScript

## 📋 Requisitos

- Node.js (v14 ou superior)
- Docker e Docker Compose
- Insomnia (ou Postman) para testes

## 🔧 Instalação

1. Clone o repositório

```bash
git clone [url-do-repositorio]
cd clubpet
```

2. Instale as dependências

```bash
npm install
```

3. Configure o arquivo .env

```env
# Já configurado com valores padrão para desenvolvimento
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=clubpet_user
DB_PASSWORD=clubpet_password
DB_DATABASE=clubpet_db
API_VERSION=1.0.0
PORT=3000
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_51R7fA54F0H3WjP8dx0RKchm89TKT4Yi4MvVg0FRiA1lW2Va5uYdj77EBVZGb3egwQb7eFYlLU9pSfNvO8cXsPLwT00aU1c6arr
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxx
```

4. Inicie o banco de dados com Docker

```bash
docker-compose up -d
```

5. Inicie a aplicação

```bash
npm run start:dev
```

## 🔍 Estrutura do Sistema

O sistema possui três entidades principais:

### 1. Donos de Pet (PetOwner)

- Gerencia informações dos proprietários dos pets
- Dados: nome, email, senha, telefone, endereço

### 2. Pets

- Cadastro e gerenciamento de pets
- Dados: nome, espécie, raça, idade, peso, histórico médico
- Relacionamentos: dono do pet e cuidador

### 3. Cuidadores/Tratadores (Caretaker)

- Profissionais que cuidam dos pets
- Dados: nome, email, senha, telefone, especialização, certificações
- Status de disponibilidade

## 📡 Endpoints da API

### Donos de Pet (PetOwner)

#### 1. Criar Dono de Pet

- **POST** `http://localhost:3000/pet-owners`
- **Body:**

```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "phone": "61999999999",
  "address": "Rua 1, Número 123"
}
```

#### 2. Listar Todos os Donos

- **GET** `http://localhost:3000/pet-owners`
- Não requer body

#### 3. Buscar Dono por ID

- **GET** `http://localhost:3000/pet-owners/1`
- Não requer body

#### 4. Atualizar Dono

- **PUT** `http://localhost:3000/pet-owners/1`
- **Body:**

```json
{
  "name": "João Silva Atualizado",
  "email": "joao@email.com",
  "phone": "61999999999",
  "address": "Rua 2, Número 456"
}
```

#### 5. Deletar Dono

- **DELETE** `http://localhost:3000/pet-owners/1`
- Não requer body

### Pets

#### 1. Criar Pet

- **POST** `http://localhost:3000/pets`
- **Body:**

```json
{
  "name": "Rex",
  "species": "Cachorro",
  "breed": "Labrador",
  "age": 3,
  "weight": 25.5,
  "medicalHistory": "Vacinado em 01/2024",
  "owner": { "id": 1 },
  "caretaker": { "id": 1 }
}
```

#### 2. Listar Todos os Pets

- **GET** `http://localhost:3000/pets`
- Não requer body

#### 3. Buscar Pet por ID

- **GET** `http://localhost:3000/pets/1`
- Não requer body

#### 4. Buscar Pets por Dono

- **GET** `http://localhost:3000/pets/owner/1`
- Não requer body

#### 5. Buscar Pets por Cuidador

- **GET** `http://localhost:3000/pets/caretaker/1`
- Não requer body

#### 6. Atualizar Pet

- **PUT** `http://localhost:3000/pets/1`
- **Body:**

```json
{
  "name": "Rex",
  "weight": 26.2,
  "medicalHistory": "Vacinado em 01/2024, vermifugado em 02/2024"
}
```

#### 7. Deletar Pet

- **DELETE** `http://localhost:3000/pets/1`
- Não requer body

### Cuidadores (Caretaker)

#### 1. Criar Cuidador

- **POST** `http://localhost:3000/caretakers`
- **Body:**

```json
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "senha123",
  "phone": "61988888888",
  "specialization": "Veterinária",
  "certifications": "CRMV-DF 1234",
  "isAvailable": true
}
```

#### 2. Listar Todos os Cuidadores

- **GET** `http://localhost:3000/caretakers`
- Não requer body

#### 3. Listar Cuidadores Disponíveis

- **GET** `http://localhost:3000/caretakers/available`
- Não requer body

#### 4. Buscar Cuidador por ID

- **GET** `http://localhost:3000/caretakers/1`
- Não requer body

#### 5. Atualizar Cuidador

- **PUT** `http://localhost:3000/caretakers/1`
- **Body:**

```json
{
  "name": "Maria Silva",
  "phone": "61988888888",
  "specialization": "Veterinária e Grooming"
}
```

#### 6. Atualizar Disponibilidade

- **PUT** `http://localhost:3000/caretakers/1/availability`
- **Body:**

```json
{
  "isAvailable": false
}
```

#### 7. Deletar Cuidador

- **DELETE** `http://localhost:3000/caretakers/1`
- Não requer body

### Informações da API

#### Versão da API

- **GET** `http://localhost:3000/version`
- Retorna a versão atual da API configurada no .env

## 🧪 Testando com Insomnia

1. Abra o Insomnia
2. Crie um novo Workspace (opcional)
3. Crie uma nova Collection chamada "ClubPet API"
4. Para cada endpoint acima, crie uma nova Request:
   - Selecione o método HTTP correto (GET, POST, PUT, DELETE)
   - Digite a URL completa
   - Para POST e PUT, configure o body como JSON
   - Envie a requisição e verifique a resposta

### Dicas de Teste

1. Primeiro crie um dono de pet (POST)
2. Use o ID retornado para testar os outros endpoints
3. Verifique se a listagem (GET) mostra o registro criado
4. Tente atualizar os dados (PUT)
5. Por fim, teste a deleção (DELETE)

## 🔐 Segurança

- Senhas são armazenadas no banco de dados (ainda será implementada a criptografia)
- Autenticação JWT será implementada em uma próxima versão
- Validações de dados serão implementadas em breve

## 🚧 Próximos Passos

1. Implementar endpoints para Pets
2. Implementar endpoints para Cuidadores
3. Adicionar autenticação JWT
4. Implementar validação de dados
5. Adicionar testes automatizados
6. Implementar documentação com Swagger

## 📝 Notas

- O sistema está em desenvolvimento
- A sincronização automática do banco de dados está ativada em ambiente de desenvolvimento
- Logs e tratamento de erros serão melhorados nas próximas versões

---

## 💳 Integração de Pagamentos com Stripe

### 🚀 Configuração do Stripe

Antes de rodar a aplicação com pagamentos, é necessário configurar as credenciais do Stripe.

1️⃣ **Adicione as credenciais no arquivo `.env`**

```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxx
FRONTEND_URL=http://localhost:3000
```

2️⃣ **Instale as dependências do Stripe na aplicação**

Caso ainda não tenha instalado, execute:

```sh
npm install stripe
```

---

### ✅ Criando uma Sessão de Pagamento

Para iniciar um pagamento, faça uma requisição **POST** para o seguinte endpoint:

- **Endpoint:** `POST /payments/checkout`
- **Body (JSON):**

```json
{
  "userId": 1,
  "caretakerId": 2,
  "amount": 50
}
```

- **Resposta esperada:**

```json
{
  "sessionId": "cs_test_xxxxxxxxxxxxxx"
}
```

Acesse `https://checkout.stripe.com/pay/cs_test_xxxxxxxxxxxxxx` para realizar o pagamento.

---

## 🔄 Configurando Webhooks do Stripe

Os webhooks são usados para atualizar automaticamente o status dos pagamentos.

### 🎯 **1. Instalar o Stripe CLI**

Baixe e instale o Stripe CLI:

- **Windows:** [Baixar aqui](https://stripe.com/docs/stripe-cli)
  ```

  ```

### 🎯 **2. Autenticar no Stripe CLI**

```sh
stripe login
```

### 🎯 **3. Iniciar o Webhook do Stripe**

Para encaminhar os eventos para sua API, execute:

```sh
stripe listen --forward-to localhost:3000/payments/webhook
```

Após iniciar a escuta, uma chave webhook, do tipo whsec_xxxxxxxxxxxxxxx será gerada, copie-a e cole no arquivo .env

### 🎯 **4. Testar Webhooks**

Após iniciar a escuta, dispare um evento de teste:

```sh
stripe trigger checkout.session.completed
```

Se tudo estiver correto, a API receberá o evento e atualizará o banco de dados.

---

## 📊 Consultando Pagamentos

- **Endpoint:** `GET /payments`
- **Resposta esperada:**

```json
[
  {
    "id": 1,
    "user": { "id": 1 },
    "caretaker": { "id": 2 },
    "amount": 50,
    "currency": "usd",
    "status": "completed",
    "createdAt": "2024-03-28T14:00:00.000Z"
  }
]
```

---

## 📢 **Conclusão**

Agora sua aplicação está integrada com o **Stripe** e suporta pagamentos com **Checkout hospedado** e **Webhooks automáticos**. 🚀
