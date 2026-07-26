import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  registerUser,
  loginUser,
  getUserProfile,
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

export default router;