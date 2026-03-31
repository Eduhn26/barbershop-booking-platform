# MagraoBarbershop — Refatoração (Monorepo)
Stack: **Next.js + Tailwind + TypeScript** (web) | **NestJS + Prisma + PostgreSQL** (api)

## Estrutura
- `apps/api` — NestJS API
- `apps/web` — Next.js App Router
- `packages/shared` — tipos/contratos compartilhados
- `docker/docker-compose.yml` — PostgreSQL local

## Como rodar (dev)
### 1) Banco
```bash
cd docker
docker compose up -d
```

### 2) API
```bash
cd apps/api
npm i
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

### 3) Web
```bash
cd apps/web
npm i
npm run dev
```

## Notas
- Auth inicial: Access Token (Bearer). Evolução planejada: refresh token em cookie httpOnly.
- Regra de agenda: índice único contra conflito por (salonId, stylistId, date, time).
