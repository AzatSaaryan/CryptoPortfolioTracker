import crypto from "crypto";
import { ethers } from "ethers";

export const createNonce = (): string => {
  return crypto.randomBytes(16).toString("hex");
};

export const verifySignature = (
  walletAddress: string,
  signature: string,
  nonce: string
): boolean => {
  try {
    const message = `Sign this message to log in. Nonce: ${nonce}`;
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
  } catch (error) {
    console.error("Signature verification failed:", error);
    return false;
  }
};
