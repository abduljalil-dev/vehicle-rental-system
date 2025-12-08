// src/modules/auth/auth.routes.ts
import { Router } from "express";
import { authController } from "./auth.controller";

export const authRoutes = Router();

// POST /api/v1/auth/signup
authRoutes.post("/signup", authController.signupUser);

// POST /api/v1/auth/signin
authRoutes.post("/signin", authController.loginUser);
