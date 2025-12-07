import express from "express";
import { bookingController } from "./booking.controller";

import { auth } from "../../middleware/auth";

const router = express.Router();

router.get("/", auth.protect, bookingController.getBookings);
router.post("/", auth.protect, bookingController.createBooking);
router.put("/:bookingId", auth.protect, bookingController.updateBookings);

export const bookingRoutes = router;
