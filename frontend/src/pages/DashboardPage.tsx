import { useEffect, useState } from "react";
import DisconnectWallet from "../components/DisconnectWallet";
import GetCurrentUser from "../components/GetCurrentUser";
import { BrowserProvider } from "ethers";
import { PublicKey, Connection } from "@solana/web3.js";

export default function Dashboard() {
  const [walletType, setWalletType] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      const type = localStorage.getItem("walletType");
      setWalletType(type);

      if (type === "metamask" && window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const addr = await signer.getAddress();
        setAddress(addr);

        const ethBalance = await provider.getBalance(addr);
        setBalance((Number(ethBalance) / 1e18).toFixed(4) + " ETH");
      } else if (type === "phantom" && window.solana) {
        const pubkey = window.solana.publicKey;
        const addr = pubkey?.toBase58();
        setAddress(addr || null);

        const connection = new Connection(import.meta.env.VITE_SOLANA_RPC_URL);

        if (addr) {
          const solBalance = await connection.getBalance(new PublicKey(addr));
          setBalance((solBalance / 1e9).toFixed(4) + " SOL");
        }
      }
    };

    fetchWalletData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-12">
      <DisconnectWallet />
      <GetCurrentUser />

      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Your Dashboard</h1>

        {address ? (
          <>
            <div className="text-gray-700">
              <span className="font-semibold">Wallet Type:</span> {walletType}
            </div>
            <div className="text-gray-700">
              <span className="font-semibold">Address:</span>{" "}
              <span className="break-all">{address}</span>
            </div>
            <div className="text-gray-700">
              <span className="font-semibold">Balance:</span>{" "}
              {balance || "Loading..."}
            </div>
          </>
        ) : (
          <p className="text-red-500">No wallet connected.</p>
        )}
      </div>
    </div>
  );
}
