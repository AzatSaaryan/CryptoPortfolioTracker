import { Request, RequestHandler, Response } from "express";
import walletService from "../services/walletService.js";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";

class WalletController {
  public getBalance: RequestHandler = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    const walletAddress = req.user.walletAddress;
    try {
      const balance = await walletService.getBalance(walletAddress);
      res.status(200).json({ balance });
    } catch (error) {
      console.error("Error fetching balance:", error);
      res.status(500).json({ message: "Failed to fetch balance" });
    }
  };
}

const walletController = new WalletController();
export default walletController;
