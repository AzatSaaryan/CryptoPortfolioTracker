import { Request, Response, NextFunction } from "express";
import User from "../models/UserModel.js";
import authRepository from "../repositories/authRepository.js";
import { UserRole } from "../models/UserModel.js";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthenticatedRequest extends Request {
  user?: typeof User.prototype;
}

interface JwtPayload {
  id: string;
  walletAddress: string;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const accsessToken =
    req.headers.authorization?.split(" ")[1] || req.cookies.jwtToken;

  if (!accsessToken) {
    res.status(401).json({ message: "Not authorized, token not available" });
    return;
  }

  try {
    const decodedToken = jwt.verify(accsessToken, JWT_SECRET) as JwtPayload;
    const user = await authRepository.findUserByWalletAddress(
      decodedToken.walletAddress
    );

    req.user = user;

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Not authorized, token not available" });
  }
};

export const isAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  if (req.user.role !== UserRole.Admin) {
    res.status(403).json({ message: "Access denied, admin only" });
    return;
  }

  next();
};
