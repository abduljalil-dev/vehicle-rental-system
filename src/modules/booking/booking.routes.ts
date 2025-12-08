import { Router } from "express";
import auth from "../../middleware/auth";
import { bookingController } from "./booking.controller";

export const bookingRoutes = Router();

// Customer or Admin: create booking
bookingRoutes.post("/", auth("admin", "customer"), bookingController.createBooking);

// Role-based: get bookings
bookingRoutes.get("/", auth("admin", "customer"), bookingController.getBookings);

// Customer: cancel, Admin: return
bookingRoutes.put(
  "/:bookingId",
  auth("admin", "customer"),
  bookingController.updateBooking
);
