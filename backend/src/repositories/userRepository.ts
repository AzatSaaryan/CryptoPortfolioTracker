import User, { IUser } from "../models/UserModel.js";

class UserRepository {
  async findUserById(id: string): Promise<IUser | null> {
    try {
      return await User.findById(id).exec();
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw new Error("User retrieval failed");
    }
  }

  async updateUser(
    id: string,
    updatedData: Partial<IUser>
  ): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(id, updatedData, {
        new: true,
      }).exec();
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("User update failed");
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await User.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("User deletion failed");
    }
  }
}

const userRepository = new UserRepository();
export default userRepository;
