# Golden Raspberry Awards API

RESTful API para consulta de produtores com maior e menor intervalo entre prêmios consecutivos na categoria **Pior Filme** do Golden Raspberry Awards.

## Tecnologias

- Node.js + TypeScript
- Express
- TypeORM + SQLite (em memória)
- InversifyJS (Injeção de Dependência)
- Vitest (Testes)

## Requisitos

- Node.js 18+
- Yarn ou NPM

## Instalação

```bash
# Clonar o repositório
git clone https://github.com/JorgeFPeres/gd-awards-api.git
cd gd-awards-api

# Instalar dependências
yarn install
# ou
npm install
```

## Executando a Aplicação

```bash
# Modo desenvolvimento
yarn dev
# ou
npm run dev

# Build e execução em produção
yarn build
yarn start
```

A API estará disponível em `http://localhost:3001`

## Endpoints

Base URL: `http://localhost:3001/api`

### Health Check

```
GET /api/health
```

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-02T22:00:00.000Z"
}
```

### Intervalo de Prêmios dos Produtores

```
GET /api/producers/awards-interval
```

Retorna o(s) produtor(es) com **maior** intervalo entre dois prêmios consecutivos e o(s) produtor(es) com **menor** intervalo.

**Resposta:**
```json
{
  "min": [
    {
      "producer": "Producer Name",
      "interval": 1,
      "previousWin": 2000,
      "followingWin": 2001
    }
  ],
  "max": [
    {
      "producer": "Producer Name",
      "interval": 10,
      "previousWin": 1990,
      "followingWin": 2000
    }
  ]
}
```

## Testes

```bash
# Executar testes
yarn test
# ou
npm test

# Executar testes em modo watch
yarn test:watch
```

## Estrutura do Projeto

```
src/
├── config/              # Container InversifyJS e tipos
├── domain/              
│   ├── entities/        # Entidades (Movie)
│   ├── interfaces/      # Contratos/Ports
│   └── services/        # Lógica de negócio
├── infrastructure/      
│   ├── csv/             # Leitor de CSV
│   ├── database/        # Conexão TypeORM/SQLite
│   ├── http/            # Controllers e rotas
│   └── repositories/    # Implementação dos repositórios
└── index.ts             # Bootstrap da aplicação

tests/
└── integration/         # Testes de integração
```

## Arquitetura

O projeto segue uma arquitetura em camadas inspirada em **DDD** e **Hexagonal Architecture**:

- **Domain**: Entidades, interfaces e regras de negócio
- **Infrastructure**: Implementações concretas (banco, HTTP, CSV)
- **Config**: Configuração de injeção de dependência

## CSV de Dados

O arquivo CSV deve estar em `data/movielist.csv` ou configurado via variável de ambiente `CSV_PATH`.

Formato esperado:
```
year;title;studios;producers;winner
1980;Movie Title;Studio Name;Producer Name;yes
```

## Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | 3001 |
| `CSV_PATH` | Caminho do arquivo CSV | `data/movielist.csv` |

