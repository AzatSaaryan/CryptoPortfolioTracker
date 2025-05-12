import authRepository from "../repositories/authRepository.js";
import { createNonce } from "../utils/authUtils.js";
import { verifySignature } from "../utils/authUtils.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
type LoginResponse = {
  token: string;
  user: {
    id: string;
    walletAddress: string;
  };
};

class AuthService {
  async generateNonce(walletAddress: string): Promise<string | undefined> {
    try {
      const nonce = createNonce();

      const user = await authRepository.findUserByWalletAddress(walletAddress);
      if (user) {
        await authRepository.updateUserNonce(walletAddress, nonce);
      } else {
        await authRepository.createUser(walletAddress, nonce);
      }
      return nonce;
    } catch (error) {
      console.error("Error generating nonce:", error);
      throw new Error("Nonce generation failed");
    }
  }

  async login(
    walletAddress: string,
    signature: string
  ): Promise<LoginResponse> {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }
    try {
      const user = await authRepository.findUserByWalletAddress(walletAddress);
      if (!user) {
        throw new Error("User not found");
      }

      const isValidSignature = verifySignature(
        walletAddress,
        signature,
        user.nonce
      );

      if (!isValidSignature) {
        throw new Error("Invalid signature");
      }
      const newNonce = createNonce();
      await authRepository.updateUserNonce(walletAddress, newNonce);

      const token = jwt.sign({ walletAddress, userId: user?._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return {
        token,
        user: { id: user._id as string, walletAddress: user.walletAddress },
      };
    } catch (error) {
      console.error("Error logging in user:", error);
      throw new Error("User login failed");
    }
  }
}

const authService = new AuthService();
export default authService;
