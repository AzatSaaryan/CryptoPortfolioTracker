import { Request, RequestHandler, Response } from "express";
import userService from "../services/userService.js";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";

class UserController {
  public updateUser: RequestHandler = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const updatedData = req.body;

    if (!userId || !updatedData) {
      res.status(400).json({ messgae: "User ID and data are required" });
      return;
    }
    try {
      const updatedUser = await userService.updateUser(userId, updatedData);
      if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating user:", error.message);
        res
          .status(500)
          .json({ message: "User update failed", error: error.message });
        return;
      }
    }
  };
  public deleteUser: RequestHandler = async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }
    try {
      const result = await userService.deleteUser(userId);
      if (!result) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error deleting user:", error.message);
        res
          .status(500)
          .json({ message: "User deletion failed", error: error.message });
        return;
      }
    }
  };

  public getCurrentUser: RequestHandler = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "User not authenticated" });
        return;
      }

      const user = {
        _id: req.user._id,
        walletAddress: req.user.walletAddress,
      };

      res.status(200).json({ message: "User retrieved successfully", user });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error retrieving current user:", error.message);
        res
          .status(500)
          .json({ message: "User retrieval failed", error: error.message });
        return;
      }
    }
  };
}

const userController = new UserController();
export default userController;
