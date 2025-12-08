import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    // Admin can optionally specify customer_id in body; otherwise use own id
    const requester = req.user!;
    const customer_id =
      requester.role === "admin" && req.body.customer_id
        ? Number(req.body.customer_id)
        : requester.id;

    const booking = await bookingServices.createBooking({
      customer_id,
      vehicle_id: req.body.vehicle_id,
      rent_start_date: req.body.rent_start_date,
      rent_end_date: req.body.rent_end_date,
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const requester = req.user!;
    const bookings = await bookingServices.getBookings(
      requester.id,
      requester.role
    );

    return res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const { status } = req.body as { status: "cancelled" | "returned" };

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "status field is required",
      });
    }

    let action: "cancel" | "return";
    if (status === "cancelled") {
      action = "cancel";
    } else if (status === "returned") {
      action = "return";
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const result = await bookingServices.updateBookingStatus(
      bookingId,
      action,
      req.user!
    );

    const msg =
      action === "cancel"
        ? "Booking cancelled successfully"
        : "Booking marked as returned successfully";

    return res.status(200).json({
      success: true,
      message: msg,
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const bookingController = {
  createBooking,
  getBookings,
  updateBooking,
};
