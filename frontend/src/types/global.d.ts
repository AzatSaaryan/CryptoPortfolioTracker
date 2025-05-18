import { EthereumProvider } from "@metamask/providers";

interface PhantomProvider {
  isPhantom: boolean;
  isConnected: boolean;
  publicKey?: {
    toBase58: () => string;
  };
  connect: () => Promise<{ publicKey: { toBase58: () => string } }>;
  disconnect: () => Promise<void>;
  signMessage: (
    message: Uint8Array,
    display: "utf8" | "hex"
  ) => Promise<{ signature: Uint8Array }>;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
    solana?: PhantomProvider;
  }
}
