# barbershop-booking-api

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?logo=springboot)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

> Backend REST API for a barbershop scheduling platform — built with Java and Spring Boot as a deliberate architectural evolution from the original NestJS implementation.

---

## Table of Contents

- [Overview](#overview)
- [Domain](#domain)
- [Stack](#stack)
- [Architecture](#architecture)
- [API Endpoints](#api-endpoints)
- [Running Locally](#running-locally)
- [Environment Variables](#environment-variables)
- [Why Java / Spring Boot?](#why-java--spring-boot)
- [Project Status](#project-status)
- [Author](#author)

---

## Overview

This repository contains the Java/Spring Boot backend for the [Barbershop Booking Platform](https://github.com/Eduhn26/barbershop-booking-platform).

The original backend was built with **NestJS + Prisma** to validate the business domain and core scheduling rules quickly. This service is a full backend rebuild using **Java and Spring Boot**, preserving the same domain while deepening the engineering approach around:

- relational persistence with JPA/Hibernate
- authentication and authorization with Spring Security
- stronger type safety and explicit structure
- structured test coverage
- long-term maintainability
- backend design aligned with enterprise-oriented environments

This is not a rewrite for its own sake. It is a deliberate engineering step to evolve backend maturity and align with Java/Spring ecosystems widely used in corporate, consulting, and fintech environments.

---

## Domain

The platform serves barbershops and manages the following core entities:

| Entity        | Responsibility                                                  |
|---------------|-----------------------------------------------------------------|
| `Salon`       | The barbershop unit that owns stylists, services, and bookings  |
| `User`        | Authenticated users with role-based access                      |
| `Service`     | Services offered by the salon (haircut, beard trim, etc.)       |
| `Appointment` | Bookings tied to a stylist, salon, date, and time slot          |

### Roles

| Role      | Access Level                                      |
|-----------|---------------------------------------------------|
| `ADMIN`   | Full management of salon, users, and appointments |
| `STYLIST` | View and manage own schedule                      |
| `CLIENT`  | Book, view, and cancel own appointments           |

### Core Business Rule

The system prevents double-booking for the same stylist in the same salon, date, and time slot.

This constraint is enforced at two levels:
- **Application layer** — validation before persisting
- **Database layer** — unique constraint on `(salon_id, stylist_id, date, time_slot)`

---

## Stack

| Layer            | Technology                      |
|------------------|---------------------------------|
| Language         | Java 21                         |
| Framework        | Spring Boot 3.x                 |
| Security         | Spring Security + JWT           |
| Persistence      | Spring Data JPA + Hibernate     |
| Database         | PostgreSQL 16                   |
| Validation       | Bean Validation (Jakarta)       |
| Documentation    | SpringDoc OpenAPI (Swagger UI)  |
| Testing          | JUnit 5 + Mockito               |
| Containerization | Docker + Docker Compose         |
| Build Tool       | Maven                           |

---

## Architecture

```txt
src/
└── main/
    └── java/
        └── com/eduhn/barbershop/
            ├── auth/           # Authentication and JWT logic
            ├── user/           # User management and roles
            ├── salon/          # Salon domain
            ├── service/        # Services catalog
            ├── appointment/    # Scheduling and conflict validation
            ├── shared/         # Exceptions, DTOs, utilities
            └── config/         # Security, CORS, OpenAPI configuration
```

Each domain module follows a consistent internal structure:

```txt
{domain}/
├── {Domain}Controller.java
├── {Domain}Service.java
├── {Domain}Repository.java
├── {Domain}.java               # Entity
└── dto/
    ├── {Domain}Request.java
    └── {Domain}Response.java
```

---

## API Endpoints

### Auth

| Method | Endpoint         | Description              | Access |
|--------|------------------|--------------------------|--------|
| POST   | `/auth/register` | Register a new user      | Public |
| POST   | `/auth/login`    | Authenticate and get JWT | Public |

### Users

| Method | Endpoint          | Description              | Access |
|--------|-------------------|--------------------------|--------|
| GET    | `/users/stylists` | List all stylists        | Public |
| GET    | `/users/me`       | Get current user profile | Auth   |

### Services

| Method | Endpoint         | Description       | Access |
|--------|------------------|-------------------|--------|
| GET    | `/services`      | List all services | Public |
| POST   | `/services`      | Create a service  | Admin  |
| DELETE | `/services/{id}` | Remove a service  | Admin  |

### Appointments

| Method | Endpoint                     | Description                        | Access          |
|--------|------------------------------|------------------------------------|-----------------|
| POST   | `/appointments`              | Book an appointment                | Client          |
| GET    | `/appointments/me`           | List my appointments               | Client          |
| GET    | `/appointments/stylist`      | List stylist schedule              | Stylist         |
| PATCH  | `/appointments/{id}/status`  | Update appointment status          | Admin / Stylist |
| GET    | `/appointments/availability` | Check stylist availability by date | Auth            |

> Full interactive documentation available at `/swagger-ui.html` when running locally.

---

## Running Locally

### Prerequisites

- Java 21+
- Maven 3.9+
- Docker and Docker Compose

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Eduhn26/barbershop-booking-api.git
cd barbershop-booking-api

# 2. Start PostgreSQL
docker compose up -d

# 3. Configure environment
cp .env.example .env

# 4. Run the application
./mvnw spring-boot:run
```

| Service    | URL                                   |
|------------|---------------------------------------|
| API        | http://localhost:8080                 |
| Swagger UI | http://localhost:8080/swagger-ui.html |

---

## Environment Variables

Copy `.env.example` to `.env` before running:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/barbershop
SPRING_DATASOURCE_USERNAME=barbershop
SPRING_DATASOURCE_PASSWORD=barbershop
JWT_SECRET=your_secret_here
JWT_EXPIRATION_MS=86400000
SERVER_PORT=8080
```

> **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## Why Java / Spring Boot?

The original backend was built with **NestJS + Prisma** to move fast, validate the domain, and test business rules early. That goal was achieved.

This Java/Spring Boot version exists for different engineering goals:

| Concern                  | NestJS (original)     | Spring Boot (this project)        |
|--------------------------|-----------------------|-----------------------------------|
| Iteration speed          | Very fast             | More deliberate                   |
| Type system              | TypeScript            | Java (strong, static)             |
| ORM / Persistence        | Prisma (schema-first) | JPA / Hibernate (entity-first)    |
| Security layer           | Passport + Guards     | Spring Security (battle-tested)   |
| Testing conventions      | Jest                  | JUnit 5 + Mockito                 |
| Enterprise ecosystem fit | Moderate              | High                              |
| Primary context          | SaaS / product speed  | Corporate-oriented backend design |

Both approaches are valid. This rebuild is about expanding backend depth, improving architectural discipline, and building stronger familiarity with the Java/Spring conventions used in professional backend environments.

The original platform repository is preserved at: [barbershop-booking-platform](https://github.com/Eduhn26/barbershop-booking-platform)

---

## Project Status

This service is currently in active development.

- [x] Initial project direction defined
- [x] Base stack selected
- [ ] Spring Boot project bootstrap
- [ ] Docker + PostgreSQL setup
- [ ] Authentication — register / login / JWT
- [ ] Role-based authorization with Spring Security
- [ ] User and stylist endpoints
- [ ] Service catalog management
- [ ] Appointment booking and conflict validation
- [ ] Appointment status lifecycle
- [ ] Test coverage
- [ ] OpenAPI documentation
- [ ] Deployment structure

---

## Author

**Eduardo Henrique**  
Backend Engineer — Java · Spring Boot · Node.js · TypeScript · Python

[![GitHub](https://img.shields.io/badge/GitHub-Eduhn26-181717?logo=github)](https://github.com/Eduhn26)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?logo=linkedin)](https://www.linkedin.com/in/eduardohnascimento/)
