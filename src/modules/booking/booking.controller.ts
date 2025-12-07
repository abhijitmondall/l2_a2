import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { vehicleService } from "../vehicle/vehicle.service";
import { userService } from "../user/user.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id } = req.body;
    const getVehicle = await vehicleService.getVehicle(vehicle_id);
    const getCustomer = await userService.getUserByID(customer_id);

    if (customer_id && !getVehicle) {
      throw new Error(`Invalid Vehicle ID: ${vehicle_id}`);
    }

    if (getVehicle?.availability_status === "booked") {
      throw new Error(
        `This ${getVehicle?.vehicle_name} is not available for booking! Please try to book another one!`
      );
    }
    // total_price = daily_rent_price × number_of_days
    // number_of_days = rent_end_date - rent_start_date
    const start = new Date(req.body?.rent_start_date as string);
    const end = new Date(req.body?.rent_end_date as string);

    const number_of_days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    req.body.total_price = (
      +getVehicle?.daily_rent_price * Math.floor(number_of_days)
    ).toFixed(2);

    if (!req.body?.customer_id) {
      req.body.customer_id = req.user?.id;
    }

    const newBooking = await bookingService.createBooking(req.body);

    if (newBooking.rows.length === 0) {
      throw new Error("Something went wrong! Please try again!");
    }

    const { vehicle_name, type, registration_number, daily_rent_price } =
      getVehicle;

    const isVehicleUpdated = await vehicleService.updateVehicle({
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status: "booked",
      vehicleId: vehicle_id,
    });

    if (!isVehicleUpdated) {
      throw new Error("Something went wrong! Please try again!");
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: newBooking.rows[0],
    });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    let bookings;

    if (req.user?.role === "admin") {
      bookings = await bookingService.getBookings();
    } else {
      bookings = await bookingService.getOwnBookings(req.user?.id);
    }

    res.status(200).json({
      success: true,
      message:
        bookings?.length === 0
          ? "No Bookings found"
          : "Bookings retrieved successfully",
      data: bookings,
    });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const updateBookings = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.bookingId;
    const userId = req.user?.id;
    const role = req.user?.role;

    const bookingRes = await bookingService.getBookingById(bookingId as string);

    if (bookingRes.length === 0) {
      throw new Error("Booking not found!");
    }

    /* ------------------ ROLE: CUSTOMER ------------------ */
    const booking = bookingRes[0];

    const getVehicle = await vehicleService.getVehicle(booking.vehicle_id);

    const { vehicle_name, type, registration_number, daily_rent_price } =
      getVehicle;

    let updatedBooking;

    if (role === "customer") {
      if (booking.customer_id !== userId) {
        throw new Error("Not your booking!");
      }

      // Check date – only cancel before start date
      const now = new Date();
      const startDate = new Date(booking.rent_start_date);

      if (now >= startDate) {
        throw new Error("Cannot cancel after start date.");
      }

      // Update booking status
      const bookingRes = await bookingService.updateBookings({
        status: req.body?.status || "canceled",
        bookingId,
      });

      updatedBooking = bookingRes;
    }

    /* ------------------ ROLE: ADMIN ------------------ */
    if (role === "admin") {
      const bookingRes = await bookingService.updateBookings({
        status: req.body?.status || "returned",
        bookingId,
      });

      updatedBooking = bookingRes;
    }

    await vehicleService.updateVehicle({
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status: "available",
      vehicleId: booking.vehicle_id,
    });

    res.status(200).json({
      success: true,
      message:
        req.body?.status === "returned"
          ? "Booking marked as returned. Vehicle is now available"
          : "Booking cancelled successfully",
      data: updatedBooking,
    });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const bookingController = {
  createBooking,
  getBookings,
  updateBookings,
};
