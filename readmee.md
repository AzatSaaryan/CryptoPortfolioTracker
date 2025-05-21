# 🛡️ Web3 Authentication Backend

## 🔍 Overview

This project implements a **secure Web3 authentication system** using **MetaMask** and **Ethereum signatures**. It allows users to authenticate using their wallet address — no passwords required. The backend is built with **Node.js**, **Express**, and **TypeScript**.

---

## 🚀 Features

- 🔐 Web3 login via Ethereum wallet (e.g. MetaMask)
- 🔁 Nonce-based signature verification
- 📄 JWT-based session management
- 🧪 Type-safe request validation with [Zod](https://zod.dev)
- 🧑‍💼 Protected user profile routes
- ✅ Clean modular architecture (routes, services, repositories)

---

## 📦 Tech Stack

- **Node.js + Express** — web framework
- **TypeScript** — strict typing
- **Zod** — runtime schema validation
- **ethers.js** — cryptographic signature verification
- **jsonwebtoken** — JWT-based authentication
- **dotenv** — environment variable management

---

## 📁 Project Structure

```
src/
├── controllers/       # Request handlers
├── middlewares/       # Auth middleware
├── repositories/      # DB access logic
├── routes/            # Express route definitions
├── models/            # Zod request validation
├── services/          # Core business logic
├── utils/             # Helper functions (e.g., nonce generation)
└── index.ts           # Entry point
```

---

### 🔐 Auth

- `POST /api/auth/nonce`

  - Body: `{ "walletAddress": "0x..." }`
  - Returns a `nonce` string to be signed

- `POST /api/auth/login`
  - Body: `{ "walletAddress": "0x...", "signature": "0x..." }`
  - Verifies signature and returns JWT token

---

### 👤 User

- `GET /api/user/profile`

  - Requires `Authorization: Bearer <token>`
  - Returns user profile

- `PUT /api/user/profile`
  - Update user info (name, email, etc.)

---

## 🛡️ Security

- Nonce-based authentication
- Signature verification with `ethers.js`
- JWT-based sessions
- Input validation using Zod schemas
- Role-based access (planned)

---

## 🧠 Potential Features

- ENS (Ethereum Name Service) integration
- Show user balance or NFTs
- Role-based permissions (admin/user)
- DAO & governance features
- Token staking or DeFi integrations

---

## 📄 License

MIT

---

## 🧪 How to Run

```bash
# Install dependencies
npm install

# Build project
npm run build

# Start development server
npm run dev
```
