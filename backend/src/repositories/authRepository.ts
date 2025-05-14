import User, { IUser } from "../models/UserModel.js";

class AuthRepository {
  async createUser(walletAddress: string, nonce: string): Promise<IUser> {
    try {
      return await User.create({ walletAddress, nonce });
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("User creation failed");
    }
  }
  async findUserByWalletAddress(walletAddress: string): Promise<IUser | null> {
    try {
      return await User.findOne({ walletAddress }).exec();
    } catch (error) {
      console.error("Error finding user by wallet address:", error);
      throw new Error("User retrieval failed");
    }
  }
  async updateUserNonce(
    walletAddress: string,
    nonce: string
  ): Promise<IUser | null> {
    try {
      return await User.findOneAndUpdate(
        { walletAddress },
        { $set: { nonce } },
        { new: true }
      ).exec();
    } catch (error) {
      console.error("Error updating user nonce:", error);
      throw new Error("User nonce update failed");
    }
  }
}

const authRepository = new AuthRepository();
export default authRepository;
