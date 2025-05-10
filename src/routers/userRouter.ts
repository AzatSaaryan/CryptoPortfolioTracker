import express, { type Router } from "express";
import { authenticateToken, isAdmin } from "../middlewares/authMiddleware.js";
import userController from "../controllers/userController.js";
import walletController from "../controllers/walletController.js";

export const userRouter: Router = express.Router();

userRouter.get("/profile", authenticateToken, userController.getCurrentUser);
userRouter.put("/profile", authenticateToken, userController.updateUser);
userRouter.get(
  "/profile/balance",
  authenticateToken,
  walletController.getBalance
);
userRouter.delete(
  "/:userId",
  authenticateToken,
  isAdmin,
  userController.deleteUser
);
