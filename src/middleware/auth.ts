import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Authorization header missing",
    });
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Invalid Authorization header format",
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: number;
      role: "admin" | "customer";
    };

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
