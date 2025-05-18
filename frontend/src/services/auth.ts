import axios from "./api";

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    walletAddress: string;
  };
}

export const getNonce = async (walletAddress: string): Promise<string> => {
  try {
    const response = await axios.post("/auth/nonce", { walletAddress });
    if (response.status === 200) {
      return response.data.nonce;
    } else {
      throw new Error("Failed to fetch nonce");
    }
  } catch (error) {
    console.error("Error fetching nonce:", error);
    throw error;
  }
};

export const login = async (
  walletAddress: string,
  signature: string | Uint8Array<ArrayBufferLike>
): Promise<LoginResponse> => {
  try {
    const response = await axios.post("/auth/login", {
      walletAddress,
      signature,
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Login failed");
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};
