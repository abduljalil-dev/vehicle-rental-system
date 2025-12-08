import { pool } from "../../config/db";
import { daysBetween } from "../../utils/dateUtils";

interface CreateBookingInput {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}

const createBooking = async (data: CreateBookingInput) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = data;

  const vehicleRes = await pool.query("SELECT * FROM vehicles WHERE id = $1", [
    vehicle_id,
  ]);
  if (vehicleRes.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  const vehicle = vehicleRes.rows[0];
  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle not available for booking");
  }

  const days = daysBetween(rent_start_date, rent_end_date);
  if (days <= 0) {
    throw new Error("rent_end_date must be after rent_start_date");
  }

  const total_price = Number(vehicle.daily_rent_price) * days;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const bookingRes = await client.query(
      `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price,
        "active",
      ]
    );

    await client.query(
      "UPDATE vehicles SET availability_status = $1 WHERE id = $2",
      ["booked", vehicle_id]
    );

    await client.query("COMMIT");
    return bookingRes.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const getBookings = async (
  userId: number,
  role: "admin" | "customer"
) => {
  if (role === "admin") {
    const result = await pool.query("SELECT * FROM bookings ORDER BY id ASC");
    return result.rows;
  }

  const result = await pool.query(
    "SELECT * FROM bookings WHERE customer_id = $1 ORDER BY id ASC",
    [userId]
  );
  return result.rows;
};

const updateBookingStatus = async (
  bookingId: number,
  action: "cancel" | "return",
  currentUser: { id: number; role: "admin" | "customer" }
) => {
  const bookingRes = await pool.query(
    "SELECT * FROM bookings WHERE id = $1",
    [bookingId]
  );
  if (bookingRes.rows.length === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingRes.rows[0];

  if (booking.status !== "active") {
    throw new Error("Only active bookings can be updated");
  }

  // cancel (customer)
  if (action === "cancel") {
    if (currentUser.role !== "customer") {
      throw new Error("Only customers can cancel bookings");
    }
    if (booking.customer_id !== currentUser.id) {
      throw new Error("You can cancel only your own bookings");
    }

    const now = new Date();
    const start = new Date(booking.rent_start_date);
    if (start <= now) {
      throw new Error("Booking can only be cancelled before start date");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      await client.query(
        "UPDATE bookings SET status = $1 WHERE id = $2",
        ["cancelled", bookingId]
      );

      await client.query(
        "UPDATE vehicles SET availability_status = $1 WHERE id = $2",
        ["available", booking.vehicle_id]
      );

      await client.query("COMMIT");
      return { status: "cancelled" };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  // return (admin)
  if (action === "return") {
    if (currentUser.role !== "admin") {
      throw new Error("Only admin can mark booking as returned");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      await client.query(
        "UPDATE bookings SET status = $1 WHERE id = $2",
        ["returned", bookingId]
      );

      await client.query(
        "UPDATE vehicles SET availability_status = $1 WHERE id = $2",
        ["available", booking.vehicle_id]
      );

      await client.query("COMMIT");
      return { status: "returned" };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  throw new Error("Unsupported action");
};

export const bookingServices = {
  createBooking,
  getBookings,
  updateBookingStatus,
};
