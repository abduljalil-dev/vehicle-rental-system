// src/middleware/auth.ts
// higher order function  return korbe function k

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

// usage: auth() or auth("admin") or auth("admin", "customer")
const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "You are not allowed!! Token missing",
        });
      }

      // token is expected to be the raw JWT (same as your sample)
      const decoded = jwt.verify(
        token,
        config.jwtSecret as string
      ) as JwtPayload & { id?: number; role?: string };

      if (!decoded.id || !decoded.role) {
        return res.status(401).json({
          success: false,
          message: "Invalid token payload",
        });
      }

      // attach to req.user (matches your express type)
      req.user = {
        id: decoded.id,
        role: decoded.role as "admin" | "customer",
      };

      // role check: if roles array provided, make sure user role is allowed
      if (roles.length && !roles.includes(decoded.role as string)) {
        return res.status(403).json({
          success: false,
          message: "unauthorized!!!",
        });
      }

      next();
    } catch (err: any) {
      res.status(401).json({
        success: false,
        message: err.message || "Authentication failed",
      });
    }
  };
};

export default auth;
