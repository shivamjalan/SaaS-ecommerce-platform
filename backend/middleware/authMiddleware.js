import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (
  req,
  res,
  next
) => {

  let token;

  // CHECK AUTH HEADER
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith(
      "Bearer"
    )
  ) {

    try {

      // GET TOKEN
      token = req.headers.authorization.split(" ")[1];

      // VERIFY TOKEN
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // GET USER
      req.user =
        await User.findById(
          decoded.id
        ).select("-password");

      next();

    } catch (error) {

      return res.status(401).json({
        error: "Not authorized, token failed",
      });

    }
  }

  // NO TOKEN
  if (!token) {

    return res.status(401).json({
      error:
        "Not authorized, no token",
    });

  }
};

export default protect;
