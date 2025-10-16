import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

const authMiddleware = async (req, res, next) => {
  try {
    const Token = req.cookies.jwt;
    if (!Token) {
      res.status(409).json("Unauthorized Access");
    }

    try {
      const decodedUser = jwt.verify(Token);

      console.log(
        "THIS CONSOLE LOG IS COMMING FROM authMiddleware Line Number 14"
      );
      console.log("User ID:", decodedUser.id);

      const User = await db.user.findUnique({
        where: {
          id: decodedUser.id,
        },
        select: {
          id: true,
          Image: true,
          name: true,
          email: true,
          role: true,
        },
      });
      if (!User) {
        return res.status(404).json({
          message: "User Not Found",
        });
      }

      req.user = User;
      next();
    } catch (error) {
      res.status(409).json("Unauthorized Access");
    }
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    req.status(500).json("Error authenticating user");
  }
};


export default authMiddleware;

