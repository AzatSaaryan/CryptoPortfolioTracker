import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const INFURA_API_KEY = process.env.INFURA_API_KEY;

class WalletService {
  private provider: ethers.JsonRpcProvider;

  constructor(rpcUrl: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  async getBalance(walletAddress: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(walletAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      throw new Error("Failed to fetch balance");
    }
  }
}

const walletService = new WalletService(INFURA_API_KEY as string);
export default walletService;
