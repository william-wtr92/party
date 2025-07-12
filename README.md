# 🎉 Party — Web Platform for Social Event Discovery

Party is a full-stack web application enabling users to **explore, create, and join social events** hosted in bars and restaurants via an interactive map. The goal is to promote **social experiences** by recommending vibrant venues and fostering meaningful encounters.

## 🧹 Tech Stack

* **Monorepo** with `pnpm` workspaces
* **Frontend**: Next.js (React) — component-driven architecture
* **Backend**: Hono.js with RPC (type-safe API interaction)
* **ORM**: Drizzle ORM (PostgreSQL)
* **Realtime**: Redis
* **Monitoring**: Prometheus + Grafana
* **Validation**: `zodValidator` (Zod)
* **Authentication**: JWT (stored in cookies, server-verified via middleware)

## ⚙️ Installation Guide

> Make sure Docker and Make are installed on your system.

```bash
cd docker/prometheus && chmod +x entrypoint.sh
make build
make up
```

Access the frontend via `http://localhost:3000`.

Prometheus and Grafana dashboards are available at their respective ports.

---

## 🌐 API Overview

All request/response types are strongly typed via Hono RPC. Zod is used server-side to validate incoming payloads.

| Method | Endpoint                                         | Description                        |
| ------ | ------------------------------------------------ | ---------------------------------- |
| POST   | `/auth/register`                                 | Register a new user                |
| POST   | `/auth/login`                                    | Login and receive JWT in cookies   |
| POST   | `/auth/logout`                                   | Logout and clear cookies           |
| GET    | `/users/me`                                      | Get current authenticated user     |
| PUT    | `/users`                                         | Update user profile                |
| DELETE | `/users`                                         | Delete user account                |
| GET    | `/places/search`                                 | Search for venues by name/type     |
| GET    | `/places/search-cords`                           | Search places by coordinates       |
| GET    | `/events/search`                                 | Search events with filters         |
| GET    | `/events/:eventId`                               | Get details of a specific event    |
| POST   | `/events`                                        | Create a new event                 |
| PUT    | `/events/:eventId`                               | Update an existing event           |
| DELETE | `/events/:eventId`                               | Delete an event                    |
| POST   | `/participants/:eventId`                         | Request to join an event           |
| GET    | `/participants/:eventId`                         | List pending/approved participants |
| POST   | `/participants/:eventId/:participationId/accept` | Accept a participant request       |
| POST   | `/reviews/:eventId`                              | Leave a review on an event         |
| GET    | `/reviews/:eventId`                              | Get reviews for an event           |
| GET    | `/metrics`                                       | Expose metrics (Prometheus format) |

All protected routes use an `auth` middleware checking the JWT stored in cookies.

---

## ✨ Key Features

### 🗺️ Interactive Map

* Dynamic map powered by Leaflet + OpenStreetMap
* Filters by venue type, proximity, date
* Real-time updates when filters change

### 🎭 Event Management

* Create/edit/delete events (requires a linked venue)
* Add images and set participant limits
* Only event owners can modify/delete events

### 👥 Participation Flow

* Users request to join events
* Owners manually accept or reject
* Accepted users can see the participants list

### ⭐ Reviews

* Participants can rate and review events
* Optional image upload in reviews

### 👤 User Accounts

* Secure registration and login
* Profile with joined and created events
* Profile updates and deletion

### 🔔 Organizer Dashboard

* Admin view for event owners
* Notification on new participation requests

### 🧠 Recommendation System

* Highlights trending places based on past events and reviews
* Personalized suggestions based on user history

---

## 🧱 Project Structure

The codebase follows **domain-driven modular architecture**, with clear separation of concerns:

```bash
features/
  └── events/
        ├── messages/       # Request/response types (RPC-safe)
        ├── repository/     # Drizzle queries scoped to domain
        ├── types/          # Domain-specific types
        └── routes.ts       # Entry point for event-specific routes
```

The backend logic is **grouped by domain** (e.g. `events`, `auth`, `users`), each featuring:

* validated routes
* business logic
* repository access (Drizzle)

---

## 🎨 Frontend Design Pattern

Our frontend applies a **component-driven approach**, strictly separating responsibilities:

* All UI components are atomic and reusable
* API calls are isolated in service modules (e.g., `eventsService.ts`)
* We use the Hono client for RPC-style typed communication with the backend

React best practices followed:

* **Smart/Dumb component separation**
* **Colocation of logic and styling**
* **Hooks for reusable behavior**
* **Zustand (or equivalent) for lightweight state management**
* **Framer Motion** for transitions (if used)

---

## 🔐 Security Measures

* JWT stored in **HTTP-only cookies**, set with `SameSite=Strict`
* JWT is verified in a backend **auth middleware** (no local/session storage)
* Input data is validated with **Zod**
* Routes are protected via role checks and context-aware guards

> Extra hardening (rate limits, CORS headers, helmet, etc.) can be added later if project scales.

---

## 📊 Observability

* **Prometheus** exposes application metrics
* **Grafana** dashboards visualize events, requests, and custom KPIs
* `/metrics` endpoint exposes Prometheus-compatible data

---

## 📌 Additional Resources

* See [ARCHITECTURE.md](./ARCHITECTURE.md) for architectural rationale and diagrams.
* See [MCD](./docs/mcd.png) & [Optimisation SQL / DrizzleORM / Caching](./docs/sql.md) for DB schema, entity structure, and example data.
