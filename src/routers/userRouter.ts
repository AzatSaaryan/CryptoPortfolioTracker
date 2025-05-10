import express, { type Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import userController from "../controllers/userController.js";

export const userRouter: Router = express.Router();

userRouter.get("/me", authenticateToken, userController.getCurrentUser);
