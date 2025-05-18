import { useState, useEffect } from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { getNonce, login } from "../services/auth";
import { useNavigate } from "react-router-dom";
import bs58 from "bs58";
import metamaskLogo from "../assets/Ui/MetaMask-icon-fox.svg";
import phantomIcon from "../assets/UI/Phantom-Icon_Transparent_Purple.png";

export default function WalletConnection() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const connectMetamask = async (): Promise<
    { signer: JsonRpcSigner; address: string } | undefined
  > => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not available");

      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      localStorage.setItem("walletType", "metamask");

      return { signer, address };
    } catch (error) {
      console.error("Metamask connection error:", error);
      alert("Error connecting metamask");
    }
  };

  const connectPhantom = async () => {
    try {
      if (!window.solana || !window.solana.isPhantom) {
        throw new Error("Phantom wallet is not available");
      }
      const response = await window.solana.connect();
      const address = response.publicKey.toBase58();

      localStorage.setItem("walletType", "phantom");
      return address;
    } catch (error) {
      console.error("Metamask connection error:", error);
      alert("Error connecting metamask");
    }
  };

  const connectWallet = async (network: "metamask" | "phantom") => {
    if (network === "metamask") {
      try {
        setLoading(true);
        const result = await connectMetamask();

        const signer = result?.signer;
        const address = result?.address;

        if (!address || !signer) {
          console.error("No wallet connected");
          return;
        }

        const nonce = await getNonce(address);
        const message = `Sign this message to log in. Nonce: ${nonce}`;
        const signature = await signer.signMessage(message);

        await login(address, signature);

        navigate("/dashboard");
      } catch (error) {
        console.error("Login error:", error);
        alert("Login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    } else if (network === "phantom") {
      try {
        setLoading(true);
        const address = await connectPhantom();
        if (!address) {
          console.log("No wallet connected");
          return;
        }

        const nonce = await getNonce(address);
        const message = `Sign this message to log in. Nonce: ${nonce}`;
        const encodedMessage = new TextEncoder().encode(message);
        const signed = await window.solana?.signMessage(encodedMessage, "utf8");

        const signature = signed?.signature;
        if (!signature) {
          console.log("Error while signing message");
          return;
        }
        const signatureBase58 = bs58.encode(signature);

        await login(address, signatureBase58);

        navigate("/dashboard");
      } catch (error) {
        console.error("Login error:", error);
        alert("Login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const checkWallet = async () => {
      const walletType = localStorage.getItem("walletType");

      if (walletType === "metamask" && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          console.log("MetaMask already connected:", accounts[0]);
        }
      }

      if (
        walletType === "phantom" &&
        window.solana &&
        window.solana.publicKey
      ) {
        console.log(
          "Phantom already connected:",
          window.solana.publicKey.toBase58()
        );
      }
    };

    checkWallet();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl w-full max-w-md text-white">
      <h1 className="text-2xl font-semibold tracking-wider">Connect Wallet</h1>

      <button
        onClick={() => connectWallet("metamask")}
        disabled={loading}
        className={`relative w-full h-17 py-3 px-6 rounded-xl transition-all duration-300 text-lg font-medium
    flex items-center justify-center
        ${"bg-green-600 hover:bg-yellow-700"}`}
      >
        <img
          src={metamaskLogo}
          alt="Metamask Logo"
          className="absolute left-4 w-10 h-10"
        />
        {" Connect Wallet"}
      </button>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-t-4 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-700 font-medium">Processing...</p>
          </div>
        </div>
      )}
      <button
        onClick={() => connectWallet("phantom")}
        disabled={loading}
        className={`relative w-full h-17 py-3 px-6 rounded-xl transition-all duration-300 text-lg font-medium
    flex items-center justify-center
        ${"bg-green-600 hover:bg-purple-600"}`}
      >
        <img
          src={phantomIcon}
          alt="Metamask Logo"
          className="absolute left-4 w-10 h-10"
        />
        {" Connect Wallet"}
      </button>
    </div>
  );
}
