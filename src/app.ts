import express, { Request, Response } from "express";
import { authRoutes } from "./modules/auth/auth.routes.ts";
import { userRoutes } from "./modules/user/user.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";
import { loggerMiddleware } from "./middleware/logger";
import { errorMiddleware } from "./middleware/errorMiddleware";

export const app = express();

app.use(express.json());
app.use(loggerMiddleware);

// Route mounting
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/bookings", bookingRoutes);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "This is the root route",
    data: { path: req.path },
  });
});

// Error handler (must be last)
app.use(errorMiddleware);
