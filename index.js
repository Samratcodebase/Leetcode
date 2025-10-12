import "dotenv/config";
import express from "express";
import authRoutes from "./src/Routes/Auth.routes.js";
const app = express();
app.use(express.json());

app.use("api/v1/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`server is Running On ${process.env.PORT}`);
});
