import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./src/Routes/Auth.routes.js";
import problemRoutes from "./src/Routes/problem.routes.js";
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);

app.listen(process.env.PORT, () => {
  console.log(`server is Running On ${process.env.PORT}`);
});
