import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const {
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price,
    status = "active",
  } = payload;

  const newBooking = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status,
    ]
  );

  return newBooking;
};

const getBookings = async () => {
  const booking = await pool.query(`SELECT * FROM bookings`);

  if (booking.rows.length === 0) {
    return [];
  }

  return booking.rows;
};

const getOwnBookings = async (customerID: string) => {
  const booking = await pool.query(
    `SELECT * FROM bookings WHERE customer_id = $1`,
    [customerID]
  );

  if (booking.rows.length === 0) {
    return [];
  }

  return booking.rows;
};

const getBookingById = async (id: string) => {
  const booking = await pool.query(`SELECT * FROM bookings WHERE id = $1`, [
    id,
  ]);

  if (booking.rows.length === 0) {
    return [];
  }

  return booking.rows;
};

const updateBookings = async (payload: Record<string, unknown>) => {
  const { status, bookingId } = payload;

  const updatedBooking = await pool.query(
    `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
    [status, bookingId]
  );

  if (updatedBooking.rows.length === 0) {
    return null;
  }

  return updatedBooking.rows[0];
};

const autoReturnBookingsService = async () => {
  try {
    const { rows: updatedBookings } = await pool.query(`
      UPDATE bookings
      SET status = 'returned'
      WHERE status = 'active'
      AND rent_end_date < NOW()
      RETURNING id, vehicle_id;
    `);

    if (updatedBookings.length === 0) return { updatedCount: 0 };

    const vehicleIds = updatedBookings.map((b) => b.vehicle_id);

    await pool.query(
      `
      UPDATE vehicles
      SET availability_status = 'available'
      WHERE id = ANY($1)
    `,
      [vehicleIds]
    );

    return { updatedCount: updatedBookings.length };
  } catch (err) {
    console.error("Auto-return service error:", err);
    throw err;
  }
};

export const bookingService = {
  createBooking,
  getBookings,
  getOwnBookings,
  getBookingById,
  updateBookings,
  autoReturnBookingsService,
};
