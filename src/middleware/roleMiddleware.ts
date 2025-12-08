import { Request, Response, NextFunction } from "express";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
  next();
};

export const requireAdminOrSelf = (paramKey: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const targetId = Number(req.params[paramKey]);
    if (req.user.role === "admin" || req.user.id === targetId) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  };
};
