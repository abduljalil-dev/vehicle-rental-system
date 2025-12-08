import { Router } from "express";
import auth from "../../middleware/auth";
import { userController } from "./user.controller";

export const userRoutes = Router();

// Admin: view all users
userRoutes.get("/", auth("admin"), userController.getAllUsers);

// Admin or self: update user
userRoutes.put(
  "/:userId",
  auth("admin", "customer"),
  userController.updateUser
);

// Admin: delete user
userRoutes.delete(
  "/:userId",
  auth("admin"),
  userController.deleteUser
);
