import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import User from "../models/User.js";

import { sendEmail } from "../utils/sendEmail.js";

/* ===================================================== */
/* ================= REGISTER USER ===================== */
/* ===================================================== */

export const registerUser = async (
  req,
  res
) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;

    // CHECK USER EXISTS
    const userExists =
      await User.findOne({
        email,
      });

    if (userExists) {

      return res.status(400).json({
        error:
          "User already exists",
      });

    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // CREATE USER
    const user = new User({
      name,
      email,
      password:
        hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message:
        "User registered successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error",
    });

  }
};

/* ===================================================== */
/* ==================== LOGIN USER ===================== */
/* ===================================================== */

export const loginUser = async (
  req,
  res
) => {

  try {

    const {
      email,
      password,
    } = req.body;

    // FIND USER
    const user =
      await User.findOne({
        email,
      });

    // CHECK USER EXISTS
    if (!user) {

      return res.status(401).json({
        error:
          "Invalid email or password",
      });

    }

    // CHECK PASSWORD
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(401).json({
        error:
          "Invalid email or password",
      });

    }

    // GENERATE TOKEN
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message:
        "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        store: user.store,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error",
    });

  }
};

/* ===================================================== */
/* =================== USER PROFILE ==================== */
/* ===================================================== */

export const getUserProfile =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user.id
        ).select("-password");

      res.json(user);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: "Server error",
      });

    }
  };

/* ===================================================== */
/* ================== FORGOT PASSWORD ================== */
/* ===================================================== */

export const forgotPassword =
  async (req, res) => {

    try {

      const {
        email,
      } = req.body;

      const user =
        await User.findOne({
          email,
        });

      // Always respond the same way (don't leak which emails exist)
      if (!user) {

        return res.json({
          message:
            "If an account exists for that email, a password reset link has been sent.",
        });

      }

      // Generate a reset token and store only its hash
      const resetToken =
        crypto.randomBytes(
          32
        ).toString("hex");

      user.resetPasswordToken =
        crypto
          .createHash("sha256")
          .update(resetToken)
          .digest("hex");

      user.resetPasswordExpire =
        Date.now() +
        60 * 60 * 1000; // 1 hour

      await user.save();

      // Prefer the configured FRONTEND_URL, then the requesting origin
      // (the deployed frontend), and finally the local dev default.
      const frontendUrl =
        process.env.FRONTEND_URL ||
        req.get("origin") ||
        "http://localhost:5173";

      const resetUrl =
        `${frontendUrl}/reset-password/${resetToken}`;

      // Send in the background so a slow/blocked SMTP
      // never delays the response or times the request out.
      sendEmail({
        to: user.email,

        subject:
          "Reset your Vendora password",

        html:
          `<p>Hi ${user.name},</p>` +
          `<p>You requested a password reset. Click the link below to set a new password (valid for 1 hour):</p>` +
          `<p><a href="${resetUrl}">Reset Password</a></p>` +
          `<p>If you didn't request this, you can safely ignore this email.</p>`,
      }).catch((error) => {

        console.error(
          "[EMAIL] Background send failed:",
          error.message || error
        );

      });

      res.json({
        message:
          "If an account exists for that email, a password reset link has been sent.",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: "Server error",
      });

    }
  };

/* ===================================================== */
/* ================== RESET PASSWORD =================== */
/* ===================================================== */

export const resetPassword =
  async (req, res) => {

    try {

      const {
        password,
      } = req.body;

      if (!password || password.length < 6) {
        return res.status(400).json({
          error: "Password must be at least 6 characters",
        });
      }

      const hashedToken =
        crypto
          .createHash("sha256")
          .update(req.params.token)
          .digest("hex");

      const user =
        await User.findOne({
          resetPasswordToken:
            hashedToken,

          resetPasswordExpire: {
            $gt: Date.now(),
          },
        });

      if (!user) {
        return res.status(400).json({
          error:
            "Invalid or expired reset token",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      user.password =
        hashedPassword;

      user.resetPasswordToken =
        null;

      user.resetPasswordExpire =
        null;

      await user.save();

      res.json({
        message:
          "Password reset successful. You can now login.",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error: "Server error",
      });

    }
  };