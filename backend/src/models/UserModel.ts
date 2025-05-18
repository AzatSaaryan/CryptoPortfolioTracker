import { Schema, Types, model, Document } from "mongoose";
import { z } from "zod";

export enum UserRole {
  Admin = "admin",
  User = "user",
}

const userSchema = new Schema(
  {
    _id: { type: Types.ObjectId, default: () => new Types.ObjectId() },
    username: { type: String },
    email: { type: String, unique: true, sparse: true },
    walletAddress: { type: String, unique: true, required: true },
    nonce: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      default: UserRole.User,
    },
  },
  { timestamps: true }
);

export const UserSchemaZod = z.object({
  _id: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
  walletAddress: z.string().min(1, "Wallet address is required"),
  nonce: z.string().min(1, "Nonce is required"),
  role: z.enum([UserRole.Admin, UserRole.User]).optional(),
});

export type IUser = z.infer<typeof UserSchemaZod> & Document;
export const UserUpdateSchemaZod = UserSchemaZod.partial();

const User = model<IUser>("User", userSchema, "users");
export default User;
