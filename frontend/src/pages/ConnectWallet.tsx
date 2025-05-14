import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";
import { getNonce, login } from "../services/auth";
import axios from "../services/api";

export default function ConnectWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    setLoading(true);
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);

      const nonce = await getNonce(address);
      const message = `Sign this message to log in. Nonce: ${nonce}`;
      const signature = await signer.signMessage(message);

      const response = await login(address, signature);
      console.log("Login response:", response);
    } catch (error) {
      console.error("Connection/login error:", error);
      alert("Error logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/auth/logout");
      if (response.status === 200) {
        console.log("Logout response:", response.data);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setWalletAddress(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      }
    };
    checkWallet();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-xl font-bold">Wallet Connection</h1>

      <button
        onClick={walletAddress ? disconnectWallet : connectWallet}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading
          ? "Processing..."
          : walletAddress
          ? `Disconnect (${walletAddress.slice(0, 6)}...${walletAddress.slice(
              -4
            )})`
          : "Connect Wallet"}
      </button>
    </div>
  );
}
