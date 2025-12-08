import { Request, Response } from "express";
import { userServices } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userServices.getAllUsers();
    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const targetId = Number(req.params.userId);
    const requester = req.user!; // set by auth()

    // Admin can update anyone, customer can update only self
    if (requester.role !== "admin" && requester.id !== targetId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      });
    }

    const isAdmin = requester.role === "admin";
    const updated = await userServices.updateUser(targetId, req.body, isAdmin);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updated,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const targetId = Number(req.params.userId);

    await userServices.deleteUser(targetId);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: null,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const userController = {
  getAllUsers,
  updateUser,
  deleteUser,
};
