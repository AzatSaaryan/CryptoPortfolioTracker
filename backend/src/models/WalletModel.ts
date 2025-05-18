import { Schema, model, Document } from "mongoose";
import { UserSchemaZod } from "./UserModel.js";
import { z } from "zod";

export const PartialUserSchemaZod = UserSchemaZod.pick({
  walletAddress: true,
  nonce: true,
});

const WalletAddressRequestSchema = z.object({
  walletAddress: z.string().min(1, "Wallet address is required"),
});

export function validateWalletAddressRequest(data: unknown) {
  try {
    return WalletAddressRequestSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(error.errors);
    }
    throw error;
  }
}
