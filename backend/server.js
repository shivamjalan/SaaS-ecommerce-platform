import "dotenv/config";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import uploadRoutes from "./routes/uploadRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import merchantProductRoutes from "./routes/merchantProductRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import merchantRoutes from "./routes/merchantRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

/* ===================================================== */
/* ==================== MIDDLEWARE ===================== */
/* ===================================================== */

app.use(cors());

app.use(express.json());
app.use("/api/payment", paymentRoutes);
/* ===================================================== */
/* ================= DATABASE CONNECTION =============== */
/* ===================================================== */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    console.log("MongoDB Connected")
  )
  .catch((err) => console.log(err));

/* ===================================================== */
/* ==================== TEST ROUTE ===================== */
/* ===================================================== */

app.get("/", (req, res) => {

  res.send("Backend is running");

});

/* ===================================================== */
/* ================== PRODUCT ROUTES =================== */
/* ===================================================== */

app.use(
  "/api/products",
  productRoutes
);
app.use(
    "/api/merchant/products",
    merchantProductRoutes
);
app.use("/api/stores", storeRoutes);
app.use(
  "/api/merchant",
  merchantRoutes
);
app.use(
  "/api/ai",
  aiRoutes
);
/* ===================================================== */
/* ==================== USER ROUTES ==================== */
/* ===================================================== */

app.use(
  "/api/users",
  userRoutes
);

/* ===================================================== */
/* ==================== ORDER ROUTES =================== */
/* ===================================================== */

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/upload",
  uploadRoutes
);
/* ===================================================== */
/* ==================== START SERVER =================== */
/* ===================================================== */


const PORT = 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});
