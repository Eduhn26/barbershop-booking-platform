# Barbershop Booking Platform

A monorepo-based scheduling platform for barbershops.

This project started as a SaaS exploration focused on appointment booking, authentication, role-based access, and service management for barbershop operations. It is now positioned as a professional backend/frontend portfolio project and a foundation for future architectural evolution.

## Current Stack

### Web
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Axios
- React Query
- Zustand

### API
- NestJS
- Prisma
- PostgreSQL
- JWT Authentication
- Passport JWT
- class-validator
- bcryptjs

### Infrastructure
- Docker Compose
- npm workspaces

## Repository Structure

```txt
.
├── apps
│   ├── api          # NestJS API
│   └── web          # Next.js frontend
├── packages
│   └── shared       # Shared types/contracts
├── docker
│   └── docker-compose.yml
├── package.json
└── README.md
