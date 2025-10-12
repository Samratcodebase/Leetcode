import { db } from "../libs/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRole } from "../../generated/prisma/index.js";
// Register controller
const register = async (req, res) => {
  const { email, password, name } = req.body;

  // Basic input validation
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Email, password, and name are required." });
  }

  // Simple email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  try {
    const existinguser = await db.user.findUnique({
      where: { email },
    });
    if (existinguser) {
      return res.status(400).json({ error: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        email,
        Password: hashedPassword,
        name,
        role: UserRole.USER,
      },
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(201).json({
      message: "User Created Successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        image: newUser.image,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// Login controller
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.status(200).json({ message: "Login successful", user: { id: user.id, email: user.email, role: user.role, image: user.image } });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logout controller
const logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
  res.status(200).json({ message: "Logout successful" });
};

// Check controller
const check = async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user: { id: user.id, email: user.email, role: user.role, image: user.image } });
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export { register, login, logout, check }