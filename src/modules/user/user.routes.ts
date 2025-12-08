import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import {
  requireAdmin,
  requireAdminOrSelf,
} from "../../middleware/roleMiddleware";
import {
  getAllUsersController,
  updateUserController,
  deleteUserController,
} from "./user.controller";

export const user.routes.tsoutes = Router();

export const userRoutes = Router();

// GET /api/v1/users - Admin only
userRoutes.get("/", authMiddleware, requireAdmin, getAllUsersController);

// PUT /api/v1/users/:userId - Admin or self
userRoutes.put(
  "/:userId",
  authMiddleware,
  requireAdminOrSelf("userId"),
  updateUserController
);

// DELETE /api/v1/users/:userId - Admin only
userRoutes.delete(
  "/:userId",
  authMiddleware,
  requireAdmin,
  deleteUserController
);
