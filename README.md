# DESAFIO: Kinvo-Backend

[Link do desafio](https://github.com/kinvoapp/node.js-challenge)

## Contexto

Um estudante a fim de poupar gastos e controlar suas finanças pessoais resolveu desenvolver um aplicativo para lhe ajudar nessa missão. Após um estudo de caso ele mapeou as seguintes funcionalidades:

- [x] Criação da movimentação (receitas e despesas);
- [x] Atualização da movimentação;
- [x] Exclusão da movimentação;
- [x] Listagem de movimentações;
- [x] Exibição do saldo.

## Requisitos

- [x] Filtro na listagem de movimentações por data (data inicial e data final);
- [x] Paginação na listagem de movimentações.
- [x] Necessidade do usuário estar autenticado para a realização das atividades citadas no contexto.

# Teste a aplicação em sua máquina

Certifique-se de ter Node.js instalados em sua máquina antes de prosseguir.

- [Node.js](https://nodejs.org/)

1. Faça o clone do projeto

```bash
git clone https://github.com/marcosparreiras/kinvo-challange.git
```

2. Navegue até diretório do projeto e instale as dependências com o comando:

```bash
npm install
```

3. Inicie a aplicação em modo de desenvolvimento:

```bash
npm run dev
```

ou, rode os testes de unidade com o comando:

```bash
npm run test
```

ou, rode os testes end-to-end com o comando:

```bash
npm run test:e2e
```

# Endpoints

### Usuários

| Método | Rota            | Necessário autorização | Descrição                                                       |
| ------ | --------------- | ---------------------- | --------------------------------------------------------------- |
| POST   | /users          | ❌                     | Cria um novo usuário na aplicação                               |
| POST   | /users/sessions | ❌                     | Inicia a sessão de um usuário e retorna um token de autorização |
| GET    | /transactions   | ✅                     | Inicia a sessão de um usuário e retorna um token de autorização |

---

#### POST /users

##### Body

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "123456"
}
```

---

#### POST /users/sessions

##### Body

```json
{
  "email": "johndoe@example.com",
  "password": "123456"
}
```

---

### Transações

| Método | Rota                  | Necessário autorização | Descrição                                                        |
| ------ | --------------------- | ---------------------- | ---------------------------------------------------------------- |
| GET    | /transactions         | ✅                     | Retorna uma lista das transações do usuário que faz a requisição |
| POST   | /transactions         | ✅                     | Cria uma nova transação para o usuário que faz a requisição      |
| GET    | /transactions/balance | ✅                     | Retorna o saldo atual do usuário que faz a requisição            |
| PUT    | /transactions/:id     | ✅                     | Atualiza os dados de uma transação do usuário                    |
| DELETE | /transactions/:id     | ✅                     | Deleta uma transação do usuário                                  |

---

#### GET /transactions

##### Headers

```bash
Authorization: Bearer token
```

##### Seach params (OPCIONAL)

```bash
page=1&startDate=12/22/2023&endDate=12/25/2023
```

---

#### POST /transactions

##### Headers

```bash
Authorization: Bearer token
```

##### body

```json
{
  "value": 120.5,
  "description": "Electricity bill payment",
  "type": "debt"
}
```

---

#### GET /transactions/balance

##### Headers

```bash
Authorization: Bearer token
```

---

#### PUT /transactions/:id

##### Headers

```bash
Authorization: Bearer token
```

##### body

```json
{
  "value": 3500.25,
  "description": "receiving salary",
  "type": "credit"
}
```

---

#### DELETE /transactions/:id

##### Headers

```bash
Authorization: Bearer token
```
