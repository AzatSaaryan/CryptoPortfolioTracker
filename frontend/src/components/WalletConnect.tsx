import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";
import { getNonce, login } from "../services/auth";
import axios from "../services/api";
import metamaskLogo from "../UI/MetaMask-icon-fox.svg";

export default function WalletConnect() {
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
    <div className="flex flex-col items-center justify-center gap-6 p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl w-full max-w-md text-white">
      <h1 className="text-2xl font-semibold tracking-wide">
        🔐 Wallet Connection
      </h1>

      <button
        onClick={walletAddress ? disconnectWallet : connectWallet}
        disabled={loading}
        className={`relative w-full h-17 py-3 px-6 rounded-xl transition-all duration-300 text-lg font-medium
    flex items-center justify-center
        ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : walletAddress
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        <img
          src={metamaskLogo}
          alt="Metamask Logo"
          className="absolute left-4 w-10 h-10"
        />
        {loading
          ? "🔄 Processing..."
          : walletAddress
          ? `🔌 Disconnect (${walletAddress.slice(
              0,
              6
            )}...${walletAddress.slice(-4)})`
          : " Connect Wallet"}
      </button>
    </div>
  );
}
