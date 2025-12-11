# 🚗 Car Rental Service API

A backend REST API for managing a vehicle rental system with role-based access control, built using **Node.js**, **TypeScript**, **Express**, and **PostgreSQL (NeonDB)**.

> **Live URL:**
> `https://vehicle-rental-server-omega.vercel.app`
> _(Replace with your actual deployment URL once hosted.)_

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication (`/api/v1/auth/signin`, `/api/v1/auth/signup`).
- Secure password hashing using **bcrypt**.
- Role-based access:
  - **Admin** – manage users, vehicles, and all bookings.
  - **Customer** – manage own profile and bookings, view vehicles.

### 🚘 Vehicle Management
- Admin can:
  - Create, update, delete vehicles.
  - Set **daily rent price** and **availability**.
- Public endpoints to:
  - List all vehicles.
  - View a specific vehicle by ID.

### 📅 Booking Management
- Customers (and Admins) can:
  - Create bookings with `rent_start_date` and `rent_end_date`.
- System validates:
  - Vehicle availability.
  - Date ranges (`rent_end_date` must be after `rent_start_date`).
- Auto price calculation:
  - `total_price = daily_rent_price × number_of_days`.
- Booking lifecycle:
  - **Customer** can cancel *before* start date.
  - **Admin** can mark booking as **returned**.
  - Vehicle availability automatically updated:
    - `available` ↔ `booked`.

### 👤 User Management
- Admin can view all users and delete users (if no active bookings).
- Admin or the user themself can update profile fields.
- Users cannot change their own role.

### 🧱 Clean & Modular Architecture
- Feature-based modules:
  - `auth`, `user`, `vehicle`, `booking` (example).
- Clear separation of concerns:
  - **routes → controllers → services → database layer**.
- Centralized config and middleware.

---

## 🛠 Technology Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (NeonDB or any Postgres instance)
- **ORM/Driver:** `pg` (node-postgres)
- **Auth:** `jsonwebtoken` (JWT)
- **Security:** `bcrypt` (password hashing)
- **Config:** `dotenv`
- **Dev Tools:** `ts-node-dev` (or `nodemon`), `tsc` (TypeScript compiler)

---

## 📂 Project Structure

```bash
src/
  app.ts               # Express app setup (routes + middleware)
  server.ts            # Server bootstrap & DB init

  config/
    index.ts           # env config (connection_str, port, jwt, etc.)
    db.ts              # Postgres Pool, query helper, initDB()

  middleware/
    auth.ts            # authMiddleware + role guards
    logger.ts          # request logger

  modules/
    auth/
      auth.controller.ts
      auth.routes.ts
      auth.service.ts

    user/
      user.controller.ts
      user.route.ts
      user.service.ts

    vehicle/
      vehicle.controller.ts
      vehicle.routes.ts
      vehicle.service.ts

    booking/
      booking.controller.ts
      booking.routes.ts
      booking.service.ts

  types/
    express/
      index.d.ts       # Extend Express.Request with req.user
