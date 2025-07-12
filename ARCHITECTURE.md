# Project Architecture

## 🏗️ Project Type

This project uses a **monolithic architecture**, where both the frontend and backend live within a single repository. This approach was chosen to simplify the development and deployment process during the MVP phase while maintaining a clear modular structure.

## 📐 Architectural Layers

```
 Route (Hono RPC handler)
   ↓
 Service (Business Logic)
   ↓
 Repository (Drizzle ORM)
   ↓
 Database (PostgreSQL)
```

## 📁 Folder Structure (Backend)

```bash
features/
  ├── auth/
  │   ├── routes.ts        # Login/register/logout routes with Zod validation
  │   ├── services.ts      # Token logic, hashing, session management
  │   └── repository.ts    # Access to users table
  ├── events/
  │   ├── routes.ts        # Event creation/update/deletion
  │   ├── services.ts      # Slot availability, filtering, image handling
  │   ├── messages.ts      # RPC-safe request/response types
  │   └── repository.ts    # Queries on events and linked addresses
  └── users/
      ├── routes.ts
      ├── services.ts
      └── repository.ts
```

## 🧱 Design Patterns Used

| Pattern                         | Purpose                                                                |
| ------------------------------- | ---------------------------------------------------------------------- |
| **Domain-Driven Modules**       | Each domain (e.g., `events`, `auth`, `users`) owns its own logic       |
| **Repository Pattern**          | Isolates database access and abstracts Drizzle operations              |
| **Service Layer**               | Centralizes business logic, keeps routes clean                         |
| **RPC (Remote Procedure Call)** | Ensures type-safe interaction between client and server using Hono RPC |
| **Smart/Dumb Components**       | Clean separation of UI components and logic in React                   |
| **Zod Validation**              | Strong runtime validation on all backend input                         |

## 🔗 RPC Type Safety

All routes use Hono RPC, meaning:

* The backend defines input/output schemas using Zod
* The frontend consumes APIs using the Hono RPC client
* No `fetch` wrappers or manual typings needed

This ensures consistency and reduces bugs between frontend and backend communication.

## 🔐 Security Layer

* JWT stored as HTTP-only cookies
* Auth middleware guards protected routes
* Backend verifies token integrity and expiration

## 📈 Observability Stack

* `/metrics` exposes application metrics in Prometheus format
* Grafana dashboards visualize API traffic, participation trends, and more

## 🤔 Why Monolith?

We chose a monolithic architecture because:

* Faster and simpler to deploy for MVP
* No overhead of service discovery or distributed logging
* Clear domain separation is still possible via feature folders

> In the future, this structure allows easy extraction of domains into microservices if scaling demands it.
