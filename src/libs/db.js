import { PrismaClient } from "../../generated/prisma/index.js";
const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// Attempt to connect and log result
db.$connect()
	.then(() => {
		console.log("✅ Database connected successfully");
	})
	.catch((err) => {
		console.error("❌ Database connection failed:", err);
	});