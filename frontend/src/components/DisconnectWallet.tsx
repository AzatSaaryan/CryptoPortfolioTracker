import axios from "../services/api";
import { useState, useEffect } from "react";
import metamaskIcon from "../assets/UI/MetaMask-icon-fox.svg";
import phantomIcon from "../assets/UI/Phantom-Icon_Transparent_Purple.png";
import { useNavigate } from "react-router-dom";

export default function DisconnectWallet() {
  const [loading, setLoading] = useState(false);
  const [walletType, setWalletType] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    setWalletType(localStorage.getItem("walletType"));
  }, []);

  const walletIcons: Record<string, string> = {
    metamask: metamaskIcon,
    phantom: phantomIcon,
  };

  const icon = walletType ? walletIcons[walletType] : null;

  const disconnectWallet = async () => {
    setLoading(true);
    try {
      if (window.ethereum) {
        const response = await axios.post("/auth/logout");
        if (response.status === 200) {
          console.log("Logout response:", response.data);
        }
      } else if (window.solana) {
        await window.solana.disconnect();

        const response = await axios.post("/auth/logout");
        if (response.status === 200) {
          console.log("Logout response:", response.data);
        }
      }

      localStorage.removeItem("walletType");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={disconnectWallet}
          disabled={loading}
          className={`flex items-center gap-x-2 px-4 py-2 rounded-xl shadow-md transition text-white
    ${
      walletType === "metamask"
        ? "bg-orange-500 hover:bg-red-900"
        : "bg-purple-600 hover:bg-red-800"
    }
  `}
        >
          {icon && (
            <img src={icon} alt={`${walletType} logo`} className="w-6 h-6" />
          )}
          Disconnect
        </button>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-t-4 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-700 font-medium">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
}
