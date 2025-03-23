# Documentação da API de Postagens

## Sumário

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Tecnologias](#tecnologias)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Modelos de Dados](#modelos-de-dados)
6. [API Endpoints](#api-endpoints)
7. [Autenticação](#autenticação)
8. [Testes](#testes)
9. [CI/CD](#cicd)
10. [Implantação](#implantação)

## Visão Geral

A API de Postagens é um sistema para gerenciamento de conteúdo educacional, onde docentes podem criar, editar e excluir postagens, enquanto alunos podem visualizar o conteúdo publicado. O sistema implementa controle de acesso baseado em papéis (RBAC) para garantir que apenas usuários autorizados possam realizar determinadas ações.

## Arquitetura

A aplicação segue uma arquitetura RESTful baseada em Node.js com Express, utilizando MongoDB como banco de dados. A arquitetura é dividida nas seguintes camadas:

1. **Camada de Apresentação**: API RESTful com endpoints para gerenciamento de usuários e postagens.
2. **Camada de Lógica de Negócios**: Implementada através de middlewares e controladores.
3. **Camada de Acesso a Dados**: Modelos Mongoose para interação com o MongoDB.

A aplicação é containerizada usando Docker, o que facilita a implantação em diferentes ambientes.

### Diagrama de Arquitetura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Cliente API   │◄────┤  Express.js API │◄────┤    MongoDB      │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                ▲
                                │
                        ┌───────┴───────┐
                        │   Middlewares │
                        │  Autenticação │
                        └───────────────┘
```

## Tecnologias

### Backend
- **Node.js**: Ambiente de execução JavaScript
- **Express**: Framework web para construção da API
- **MongoDB**: Banco de dados NoSQL
- **Mongoose**: ODM (Object Data Modeling) para MongoDB
- **JWT**: JSON Web Tokens para autenticação
- **bcryptjs**: Para hash de senhas
- **Swagger**: Documentação da API

### DevOps
- **Docker**: Containerização da aplicação
- **Docker Compose**: Orquestração de múltiplos contêineres
- **GitHub Actions**: CI/CD para testes e implantação automática
- **Jest**: Framework de testes

## Estrutura do Projeto

```
/
├── .github/workflows/    # Configurações do GitHub Actions
├── models/               # Modelos de dados Mongoose
│   ├── user.js           # Modelo de usuário
│   └── post.js           # Modelo de postagem
├── middleware/           # Middlewares da aplicação
│   └── auth.js           # Middleware de autenticação
├── routes/               # Rotas da API
│   ├── auth.js           # Rotas de autenticação
│   ├── posts.js          # Rotas de postagens
│   └── users.js          # Rotas de usuários
├── __tests__/            # Testes automatizados
├── app.js                # Ponto de entrada da aplicação
├── swagger.js            # Configuração do Swagger
├── Dockerfile            # Configuração do Docker
├── docker-compose.yml    # Configuração do Docker Compose
└── package.json          # Dependências e scripts
```

## Modelos de Dados

### Usuário

```json
{
  "username": "string, único, obrigatório",
  "email": "string, único, obrigatório",
  "password": "string, hash, obrigatório",
  "name": "string, obrigatório",
  "role": "enum: ['docente', 'aluno'], default: 'aluno'",
  "tokens": "array de tokens JWT"
}
```

### Postagem

```json
{
  "title": "string, obrigatório",
  "content": "string, obrigatório",
  "author": "referência ao ID do usuário, obrigatório",
  "tags": "array de strings",
  "likes": "número, default: 0",
  "authorType": "enum: ['docente', 'aluno'], default: 'docente'",
  "createdAt": "data de criação",
  "updatedAt": "data de atualização"
}
```

## API Endpoints

### Autenticação

- **POST /api/auth/register**
  - Registra um novo usuário
  - Corpo: `{ username, email, password, name, role }`
  - Retorno: `{ user, token }`

- **POST /api/auth/login**
  - Autentica um usuário
  - Corpo: `{ email, password }`
  - Retorno: `{ user, token }`

- **POST /api/auth/logout**
  - Realiza logout (requer autenticação)
  - Retorno: `{ message }`

### Usuários

- **GET /api/users**
  - Lista todos os usuários
  - Retorno: Array de usuários

- **GET /api/users/:id**
  - Obtém detalhes de um usuário específico
  - Retorno: Objeto de usuário

- **POST /api/users**
  - Cria um novo usuário
  - Corpo: `{ username, email, password, name, role }`
  - Retorno: Objeto do usuário criado

- **GET /api/users/:id/posts**
  - Lista todas as postagens de um usuário específico
  - Retorno: Array de postagens

### Postagens

- **GET /api/posts**
  - Lista todas as postagens
  - Retorno: Array de postagens

- **GET /api/posts/search**
  - Busca postagens por termo
  - Query: `?q=termo`
  - Retorno: Array de postagens correspondentes

- **GET /api/posts/:id**
  - Obtém detalhes de uma postagem específica
  - Retorno: Objeto de postagem

- **POST /api/posts**
  - Cria uma nova postagem (apenas docentes)
  - Corpo: `{ title, content, tags }`
  - Retorno: Objeto da postagem criada

- **PUT /api/posts/:id**
  - Atualiza uma postagem existente (apenas docente autor)
  - Corpo: `{ title, content, tags }`
  - Retorno: Objeto da postagem atualizada

- **DELETE /api/posts/:id**
  - Exclui uma postagem (apenas docente autor)
  - Retorno: `{ message }`

## Autenticação

O sistema utiliza autenticação baseada em JWT (JSON Web Tokens).

### Fluxo de Autenticação

1. O usuário se registra ou faz login
2. A API gera um token JWT e o retorna
3. O cliente deve incluir este token no cabeçalho `Authorization` em todas as requisições subsequentes
4. O formato do cabeçalho deve ser: `Authorization: Bearer <token>`

### Controle de Acesso

- Rotas públicas: Qualquer pessoa pode acessar
- Rotas protegidas: Requerem autenticação
- Rotas de docentes: Requerem autenticação e papel de 'docente'
- Rotas de autor: Requerem que o usuário seja o autor do recurso

## Testes

A aplicação inclui testes automatizados para garantir seu funcionamento correto.

### Tipos de Testes

- **Testes Unitários**: Testam componentes individuais

### Executando Testes

```bash
# Executar todos os testes
npm test

# Executar testes com cobertura
npm run test:coverage
```

## CI/CD

O projeto utiliza GitHub Actions para integração e entrega contínuas.

### Workflow

1. **Teste**: Executa os testes automatizados
2. **Build**: Constrói a aplicação
3. **Deploy**: Implanta a aplicação em produção (apenas para a branch principal)

## Implantação

A aplicação pode ser implantada usando Docker.

### Ambiente de Desenvolvimento

```bash
# Iniciar os contêineres
docker-compose up -d

# Parar os contêineres
docker-compose down
```

### Ambiente de Produção

Para implantação em produção, configure as variáveis de ambiente:

```
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb://seu-servidor-mongodb:27017/sua-base
JWT_SECRET=seu-segredo-jwt
```

## Considerações de Segurança

- Senhas são armazenadas como hash usando bcrypt
- Autenticação é feita via JWT com expiração
- Controle de acesso é baseado em papéis (RBAC)
- Validação de entrada em todas as rotas
- Sanitização de saída para prevenir XSS
- Proteção contra injeção em consultas MongoDB

---

## Como Começar

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- MongoDB (ou use o contêiner Docker)

### Instalação

1. Clone o repositório
2. Execute `npm install`
3. Configure as variáveis de ambiente
4. Execute `docker-compose up -d`
5. Acesse a API em http://localhost:3000
6. Acesse a documentação Swagger em http://localhost:3000/api-docs