import { IUser } from "../models/UserModel.js";
import userRepository from "../repositories/userRepository.js";

class UserService {
  async findUserById(id: string) {
    try {
      const user = await userRepository.findUserById(id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw new Error("User retrieval failed");
    }
  }
  async updateUser(id: string, updatedData: Partial<IUser>) {
    try {
      const user = await userRepository.updateUser(id, updatedData);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("User update failed");
    }
  }

  async deleteUser(id: string) {
    try {
      const result = await userRepository.deleteUser(id);
      if (!result) {
        throw new Error("User not found");
      }
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("User deletion failed");
    }
  }
}

const userService = new UserService();
export default userService;
