# Documentação da API de Postagens

## Sumário

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Tecnologias](#tecnologias)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Modelos de Dados](#modelos-de-dados)
6. [API Endpoints](#api-endpoints)
7. [Controle de Acesso](#controle-de-acesso)
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
                        │ Verificação de│
                        │     Papel     │
                        └───────────────┘
```

## Tecnologias

### Backend
- **Node.js**: Ambiente de execução JavaScript
- **Express**: Framework web para construção da API
- **MongoDB**: Banco de dados NoSQL
- **Mongoose**: ODM (Object Data Modeling) para MongoDB
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
│   └── isDocente.js      # Middleware de verificação de papel
├── routes/               # Rotas da API
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
  "password": "string, hash, opcional",
  "name": "string, obrigatório",
  "role": "enum: ['docente', 'aluno'], default: 'aluno'"
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
  - Corpo: `{ title, content, author, tags }`
  - Retorno: Objeto da postagem criada

- **PUT /api/posts/:id**
  - Atualiza uma postagem existente (apenas docente autor)
  - Corpo: `{ title, content, author, tags }`
  - Retorno: Objeto da postagem atualizada

- **DELETE /api/posts/:id**
  - Exclui uma postagem (apenas docente autor)
  - Corpo: `{ author }`
  - Retorno: `{ message }`

## Controle de Acesso

O sistema utiliza um middleware de verificação de papel para controle de acesso.

### Identificação do Usuário

Para operações protegidas (criação, edição, exclusão de posts), é necessário fornecer o ID do autor no corpo da requisição através do campo `author`.

### Níveis de Acesso

- **Público**: Qualquer pessoa pode listar e visualizar usuários e postagens
- **Docentes**: Apenas usuários com papel "docente" podem criar postagens
- **Autor**: Apenas o autor de uma postagem pode editá-la ou excluí-la

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
```

## Considerações de Segurança

- Senhas são armazenadas como hash usando bcrypt
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