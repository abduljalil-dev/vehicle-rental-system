import { Request, Response, NextFunction } from "express";
import * as userService from "./user.service";

export const getAllUsersController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.userId);
    const isAdmin = req.user?.role === "admin";
    const user = await userService.updateUser(id, req.body, !!isAdmin);
    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.userId);
    await userService.deleteUser(id);
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
