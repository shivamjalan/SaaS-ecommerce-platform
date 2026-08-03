import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";

const router = express.Router();

/* ===================================================== */
/* ================= REGISTER USER ===================== */
/* ===================================================== */

router.post(
  "/register",
  registerUser
);

/* ===================================================== */
/* ==================== LOGIN USER ===================== */
/* ===================================================== */

router.post(
  "/login",
  loginUser
);

/* ===================================================== */
/* =================== USER PROFILE ==================== */
/* ===================================================== */

router.get(
  "/profile",
  protect,
  getUserProfile
);

/* ===================================================== */
/* ================ FORGOT PASSWORD ==================== */
/* ===================================================== */

router.post(
  "/forgot-password",
  forgotPassword
);

/* ===================================================== */
/* ================= RESET PASSWORD ==================== */
/* ===================================================== */

router.put(
  "/reset-password/:token",
  resetPassword
);

export default router;