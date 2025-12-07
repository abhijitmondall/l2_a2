import express, { Request, Response } from "express";

import initDB, { pool } from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/user/user.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";

import "./cron/autoReturnCron";

const app = express();

app.use(express.json());

// Init DB
initDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/bookings", bookingRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Invalid endpoint: ${req.originalUrl}`,
  });
});

export default app;
