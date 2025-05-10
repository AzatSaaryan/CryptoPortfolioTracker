import { Request, Response, NextFunction } from "express";
import User from "../models/UserModel.js";
import userRepository from "../repositories/userRepository.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthenticatedRequest extends Request {
  user?: typeof User.prototype;
}

interface JwtPayload {
  id: string;
  email: string;
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
    const user = await userRepository.findUserById(decodedToken.id);

    req.user = user;

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Not authorized, token not available" });
  }
};
