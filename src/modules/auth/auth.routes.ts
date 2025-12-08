import { Router } from "express";
import { signupController, signinController } from "./auth.controller";

export const authRoutes = Router();

authRoutes.post("/signup", signupController);
authRoutes.post("/signin", signinController);
