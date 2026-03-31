# barbershop-booking-api

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?logo=springboot)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

> Backend REST API for a barbershop scheduling platform — built with Java and Spring Boot as a deliberate architectural evolution from the original NestJS implementation.

---

## Overview

This repository is the Java/Spring Boot backend of the [Barbershop Booking Platform](https://github.com/Eduhn26/barbershop-booking-platform).

The original backend was built with NestJS and Prisma to validate the domain and business rules quickly. This service is a full rebuild of that backend using Java and Spring Boot — with the same domain, same business rules, and a stronger focus on:

- corporate-grade API design
- relational persistence with JPA/Hibernate
- authentication and authorization with Spring Security
- structured testing
- production-ready structure

This is not a rewrite for its own sake. It is a deliberate engineering decision to deepen backend maturity and align with Java/Spring ecosystems that are widely demanded in enterprise, fintech, and consulting environments.

---

## Domain

The platform serves barbershops and manages:

| Entity      | Responsibility                                              |
|-------------|-------------------------------------------------------------|
| `Salon`     | The barbershop unit owning stylists, services and bookings  |
| `User`      | Authenticated users with role-based access                  |
| `Service`   | Services offered by the salon (haircut, beard trim, etc.)   |
| `Appointment` | Bookings tied to a stylist, salon, date and time slot     |

### Roles

| Role      | Access level                                        |
|-----------|-----------------------------------------------------|
| `ADMIN`   | Full management of salon, users and appointments    |
| `STYLIST` | View and manage own schedule                        |
| `CLIENT`  | Book, view and cancel own appointments              |

### Core Business Rule

The system prevents double-booking for the same stylist in the same salon, date and time slot. This constraint is enforced both at the application layer and at the database level.

---

## Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Language       | Java 21                           |
| Framework      | Spring Boot 3.x                   |
| Security       | Spring Security + JWT             |
| Persistence    | Spring Data JPA + Hibernate       |
| Database       | PostgreSQL 16                     |
| Validation     | Bean Validation (Jakarta)         |
| Documentation  | SpringDoc OpenAPI (Swagger UI)    |
| Testing        | JUnit 5 + Mockito                 |
| Containerization | Docker + Docker Compose         |
| Build          | Maven                             |

---

## Architecture

```
src/
└── main/
    └── java/
        └── com/eduhn/barbershop/
            ├── auth/           # Authentication and JWT logic
            ├── user/           # User management and roles
            ├── salon/          # Salon domain
            ├── service/        # Barbershop services catalog
            ├── appointment/    # Scheduling and conflict validation
            ├── shared/         # Exception handling, DTOs, utilities
            └── config/         # Security, CORS, OpenAPI configuration
```

Each domain module follows a consistent structure:

```
{domain}/
├── {Domain}Controller.java
├── {Domain}Service.java
├── {Domain}Repository.java
├── {Domain}.java              # Entity
└── dto/
    ├── {Domain}Request.java
    └── {Domain}Response.java
```

---

## API Endpoints

### Auth
| Method | Endpoint             | Description              | Access  |
|--------|----------------------|--------------------------|---------|
| POST   | `/auth/register`     | Register a new user      | Public  |
| POST   | `/auth/login`        | Authenticate and get JWT | Public  |

### Users
| Method | Endpoint             | Description              | Access  |
|--------|----------------------|--------------------------|---------|
| GET    | `/users/stylists`    | List all stylists        | Public  |
| GET    | `/users/me`          | Get current user profile | Auth    |

### Services
| Method | Endpoint             | Description              | Access  |
|--------|----------------------|--------------------------|---------|
| GET    | `/services`          | List all services        | Public  |
| POST   | `/services`          | Create a service         | Admin   |
| DELETE | `/services/{id}`     | Remove a service         | Admin   |

### Appointments
| Method | Endpoint                       | Description                          | Access  |
|--------|--------------------------------|--------------------------------------|---------|
| POST   | `/appointments`                | Book an appointment                  | Client  |
| GET    | `/appointments/me`             | List my appointments                 | Client  |
| GET    | `/appointments/stylist`        | List stylist's schedule              | Stylist |
| PATCH  | `/appointments/{id}/status`    | Update appointment status            | Admin/Stylist |
| GET    | `/appointments/availability`   | Check stylist availability by date   | Auth    |

Full documentation available at `/swagger-ui.html` when running locally.

---

## Running Locally

### Prerequisites

- Java 21+
- Docker and Docker Compose
- Maven 3.9+

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Eduhn26/barbershop-booking-api.git
cd barbershop-booking-api

# 2. Start PostgreSQL with Docker
docker compose up -d

# 3. Copy environment variables
cp .env.example .env

# 4. Run the application
./mvnw spring-boot:run
```

API will be available at: `http://localhost:8080`  
Swagger UI at: `http://localhost:8080/swagger-ui.html`

---

## Environment Variables

```env
# .env.example
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/barbershop
SPRING_DATASOURCE_USERNAME=barbershop
SPRING_DATASOURCE_PASSWORD=barbershop
JWT_SECRET=your_secret_here
JWT_EXPIRATION_MS=86400000
SERVER_PORT=8080
```

---

## Architecture Decision: Why Java/Spring Boot?

The original backend was built with **NestJS + Prisma** to move fast, validate the domain, and test business rules quickly. That goal was achieved.

This rebuild exists for different reasons:

| Concern                     | NestJS (original)         | Spring Boot (this service)         |
|-----------------------------|---------------------------|------------------------------------|
| Iteration speed             | Very fast                 | Deliberate                         |
| Type system                 | TypeScript                | Java (strong, static)              |
| ORM/Persistence             | Prisma (schema-first)     | JPA/Hibernate (entity-first)       |
| Security layer              | Passport + Guards         | Spring Security (battle-tested)    |
| Testing conventions         | Jest                      | JUnit 5 + Mockito                  |
| Enterprise ecosystem fit    | Moderate                  | High                               |
| Target environment          | Startups / SaaS           | Fintechs / Consulting / Corporate  |

Both approaches are valid. The decision to rebuild in Java is about deepening backend engineering maturity and aligning with corporate-grade environments — not about replacing the original implementation.

The original platform repository is preserved at: [barbershop-booking-platform](https://github.com/Eduhn26/barbershop-booking-platform)

---

## Project Status

This service is currently in active development.

- [x] Project structure and base configuration
- [x] Docker + PostgreSQL setup
- [ ] Authentication (register / login / JWT)
- [ ] Role-based authorization
- [ ] User and Stylist endpoints
- [ ] Service catalog management
- [ ] Appointment booking and conflict validation
- [ ] Status lifecycle management
- [ ] Test coverage
- [ ] OpenAPI documentation
- [ ] Production deployment structure

---

## Author

**Eduardo Henrique**  
Backend Engineer — Java · Spring Boot · Node.js · TypeScript · Python  
[GitHub](https://github.com/Eduhn26) · [LinkedIn](https://linkedin.com/in/seu-linkedin-aqui)
