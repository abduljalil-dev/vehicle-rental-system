import { Router } from "express";
import auth from "../../middleware/auth";
import { vehicleController } from "./vehicle.controller";

export const vehicleRoutes = Router();

// Admin: add vehicle
vehicleRoutes.post("/", auth("admin"), vehicleController.createVehicle);

// Public: list vehicles
vehicleRoutes.get("/", vehicleController.getAllVehicles);

// Public: get vehicle details
vehicleRoutes.get("/:vehicleId", vehicleController.getVehicle);

// Admin: update vehicle
vehicleRoutes.put("/:vehicleId", auth("admin"), vehicleController.updateVehicle);

// Admin: delete vehicle (no active bookings)
vehicleRoutes.delete(
  "/:vehicleId",
  auth("admin"),
  vehicleController.deleteVehicle
);
