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
      // PRINT AUTH HEADER
console.log("Authorization Header:");
console.log(req.headers.authorization);

// GET TOKEN
token = req.headers.authorization.split(" ")[1];

console.log("-------------------------");
console.log("Extracted Token:");
console.log(token);
console.log("-------------------------");

// VERIFY TOKEN
const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET
);

console.log("-------------------------");
console.log("Decoded JWT:");
console.log(decoded);
console.log("-------------------------");

      // GET USER
      req.user =
        await User.findById(
          decoded.id
        ).select("-password");

      next();

    } catch (error) {

  console.log("========== JWT ERROR ==========");
  console.log(error);
  console.log("========== END ERROR ==========");

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