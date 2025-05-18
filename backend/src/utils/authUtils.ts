import crypto from "crypto";
import { ethers } from "ethers";
import { PublicKey } from "@solana/web3.js";
import { verify, etc } from "@noble/ed25519";
import bs58 from "bs58";

etc.sha512Sync = (data: Uint8Array) => {
  return crypto.createHash("sha512").update(data).digest();
};

export const createNonce = (): string => {
  return crypto.randomBytes(16).toString("hex");
};

/// For Metamask
export const verifyEthereumSignature = (
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

/// For Phantom Wallet
export const verifySolanaSignature = async (
  walletAddress: string,
  signatureBase58: string,
  nonce: string
): Promise<boolean> => {
  try {
    const message = `Sign this message to authenticate. Nonce: ${nonce}`;
    const encodedMessage = new TextEncoder().encode(message);
    const publicKey = new PublicKey(walletAddress);

    const signature = bs58.decode(signatureBase58);

    const isValid = await verify(
      signature,
      encodedMessage,
      publicKey.toBytes()
    );
    return isValid;
  } catch (error) {
    console.error("Error verifying Solana signature:", error);
    return false;
  }
};

export const verifySignature = async (
  walletAddress: string,
  signature: string,
  nonce: string
): Promise<boolean> => {
  if (walletAddress.startsWith("0x")) {
    return verifyEthereumSignature(walletAddress, signature as string, nonce);
  } else {
    return verifySolanaSignature(walletAddress, signature, nonce);
  }
};
