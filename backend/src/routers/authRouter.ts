import express, { type Router } from "express";
import authController from "../controllers/authController.js";

export const authRouter: Router = express.Router();

authRouter.post("/nonce", authController.generateNonce);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logoutUser);
