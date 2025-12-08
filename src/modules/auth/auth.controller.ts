import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";

export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.signup(req.body);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const signinController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.signin(req.body);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result, // { token, user }
    });
  } catch (err) {
    next(err);
  }
};
