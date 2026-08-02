import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

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