import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import { authRouter } from "./routers/authRouter.js";
import { userRouter } from "./routers/userRouter.js";

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

const PORT = process.env.PORT || 5001;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port:    http://localhost:${PORT}`);
    });
  })
  .catch((error: any) => {
    console.error("Error starting server:", error);
    process.exit(1);
  });
