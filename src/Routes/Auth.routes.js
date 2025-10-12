import express from "express";
import { register } from "../controllers/user.controller.js";
const authRoutes = express.Router();

authRoutes.post("/register", register);
// authRoutes.post("/login");
// authRoutes.post("/logout");
// authRoutes.post("/check");
export default authRoutes;
