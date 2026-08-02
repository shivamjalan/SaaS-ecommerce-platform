/* ===================================================== */
/* ============= CREATE / PROMOTE ADMIN ================ */
/* ===================================================== */
/*                                                       */
/* Usage: npm run seed:admin -- <email> <password>       */
/* Runs from backend/ so backend/.env is loaded.         */
/*                                                       */
/* ===================================================== */

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../models/User.js";

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {

  console.error(
    "Usage: npm run seed:admin -- <email> <password>"
  );

  process.exit(1);

}

if (!process.env.MONGO_URI) {

  console.error(
    "MONGO_URI is not set. Run this from backend/ so .env loads."
  );

  process.exit(1);

}

try {

  await mongoose.connect(process.env.MONGO_URI);

  const existing =
    await User.findOne({ email });

  const hashedPassword =
    await bcrypt.hash(password, 10);

  if (existing) {

    existing.role = "superadmin";
    existing.password = hashedPassword;

    await existing.save();

    console.log(
      `Superadmin promoted: ${email}`
    );

  } else {

    await User.create({
      name: "Superadmin",
      email,
      password: hashedPassword,
      role: "superadmin",
    });

    console.log(
      `Superadmin created: ${email}`
    );

  }

} catch (error) {

  console.error(error);

  process.exit(1);

} finally {

  await mongoose.disconnect();

}
