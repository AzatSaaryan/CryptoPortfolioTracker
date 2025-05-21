# 🔗 ChainPass — Secure Multi-Chain Web3 Authentication dApp

---

## 📁 Project Structure

```
/
├── backend/ # Backend API (Node.js, Express, TypeScript)
├── frontend/ # Frontend dApp (React, Redux, Web3 Integration)
├── .gitignore
├── README.md
```

---

## 🚀 Overview

**WalletGate** is a modern Web3 decentralized application enabling secure authentication through Ethereum (MetaMask) and Solana (Phantom) wallets.

No passwords needed — authentication relies on cryptographic signature verification and JWT sessions for seamless and secure access.

The dApp includes:

- Multi-chain wallet support (Ethereum + Solana)
- Nonce-based message signing for proof of wallet ownership
- Protected user dashboard & profile management
- Wallet connect & disconnect UI with clear branding
- Redux-powered reactive user state management

Future plans include ENS/SNS integration, NFT and balance display, role-based access control, DAO governance, and DeFi features.

---

## ⚙️ Getting Started

### Backend Setup

```bash
cd backend
npm install
```

Create a .env file with necessary environment variables (JWT_SECRET, RPC URLs, etc.).

Start the server: ``` npm run dev ```
The backend API will run on the configured port (e.g., `http://localhost:4000`).

### Frontend Setup

```bash
cd frontend
npm install
npm run start
```

The frontend dApp will be available at `http://localhost:3000`.

---

### 📦 Features

🔐 Multi-Chain Wallet Authentication (MetaMask & Phantom)

📝 Nonce Signing & Signature Verification

🔑 JWT-Based Session Management

🖥️ Protected Dashboard & Profile Pages

🎨 Custom Wallet Connect/Disconnect UI

⚡ Redux for Global User State

---