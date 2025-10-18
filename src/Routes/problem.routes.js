import express from "express";
import { authMiddleware, checkAdmin } from "../Middleware/auth.middleware.js";
import {
  createProblem,
  getAllproblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getSolvedProblems,
} from "../controllers/problem.controller.js";
const router = express.Router();

router.post("/create-problem", authMiddleware, checkAdmin, createProblem);
router.get("/get-all-problems", authMiddleware, getAllproblems);
router.get("/get-problem/:id", authMiddleware, getProblemById);
router.put("/update-problem/:id", authMiddleware, checkAdmin, updateProblem);
router.delete("/delete-problem/:id", authMiddleware, checkAdmin, deleteProblem);
router.get("/get-solved-problems", authMiddleware, getSolvedProblems);
export default router;
