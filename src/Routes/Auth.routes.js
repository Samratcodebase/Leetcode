import express from "express";
import {
  register,
  login,
  logout,
  check,
} from "../controllers/user.controller.js";
import authMiddleware from "../Middleware/auth.middleware.js";
const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", authMiddleware, login);
authRoutes.post("/logout", authMiddleware, logout);
authRoutes.get("/check", authMiddleware, check);
export default authRoutes;
