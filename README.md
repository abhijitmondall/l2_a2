# 🚗 Vehicle Rental System

## Live URL: https://l2a2-pi.vercel.app/

## Features

- Vehicles – Manage vehicle inventory with availability tracking
- Customers – Manage customer accounts and profiles
- Bookings – Handle vehicle rentals, returns, and cost calculation
- Authentication – Secure role-based access control (Admin and Customer roles)
- Automated Booking Lifecycle – System auto-marks bookings as returned when rental period ends
- Invalid Endpoint Handling – Returns JSON error for undefined routes

## Technology Stack

- Backend: Node.js, Express.js
- Database: PostgreSQL
- Querying: pg
- Scheduling: node-cron (for auto-return bookings)
- Authentication: JWT
- Languages: TypeScript

## API Routes

| Route              | Methods             | Description                                     |
| ------------------ | ------------------- | ----------------------------------------------- |
| `/api/v1/auth`     | POST                | Register/Login Users                            |
| `/api/v1/users`    | GET/PUT/DELETE      | Manage users                                    |
| `/api/v1/vehicles` | GET/POST/PUT/DELETE | Vehicle CRUD and availability                   |
| `/api/v1/bookings` | GET/POST/PUT        | Booking creation, view, cancel, and auto-return |

## Setup & Usage Instructions

#### 1. Clone the repository:

`git clone: https://github.com/abhijitmondall/l2_a2.git`

#### 2. Install dependencies:

`npm install`

#### 3. Configure environment variables in .env file:

`DATABASE_URL=your_postgresql_connection_string JWT_SECRET=your_jwt_secret PORT=3000`

## Run the server

`npm run dev`
