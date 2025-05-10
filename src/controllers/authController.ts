import { Request, RequestHandler, Response } from "express";
import authService from "./../services/authService.js";
import {
  validateNonceRequest,
  validateWalletAddressRequest,
} from "../models/WalletModel.js";

class AuthController {
  public generateNonce: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    try {
      const data = validateWalletAddressRequest(req.body);

      const { walletAddress } = data;

      const nonce = await authService.generateNonce(walletAddress);
      res.status(200).json({ nonce });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error generating nonce:", error.message);
        res.status(400).json({ message: "Nonce generation failed" });
        return;
      }
    }
  };

  public login: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { walletAddress, signature } = req.body;
      if (!walletAddress || !signature) {
        res
          .status(400)
          .json({ message: "Wallet address and signature are required" });
        return;
      }
      const { token, user } = await authService.login(walletAddress, signature);
      res.cookie("jwtToken", token, {
        httpOnly: true,
        sameSite: "strict",
      });
      res.status(200).json({
        message: "User logged in successfully",
        token,
        user,
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error logging in user:", error.message);
        res.status(401).json({ message: "User login failed" });
        return;
      }
    }
  };

  public logoutUser: RequestHandler = async (req: Request, res: Response) => {
    try {
      const session = req.cookies.jwtToken as string;
      if (session) {
        res.clearCookie("jwtToken", { httpOnly: true, sameSite: "strict" });
        res.status(200).json({ message: "User logged out successfully" });
        return;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error logging out user:", error.message);
        res
          .status(500)
          .json({ message: "User logout failed", error: error.message });
        return;
      }
    }
  };
}

const authController = new AuthController();
export default authController;
