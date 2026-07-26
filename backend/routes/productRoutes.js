import express from "express";

import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";
import publicStore from "../middleware/publicStoreMiddleware.js";
import merchant from "../middleware/merchantMiddleware.js";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
} from "../controllers/productController.js";

const router = express.Router();

/* ===================================================== */
/* ====================== SEED ========================= */
/* ===================================================== */

router.get(
  "/seed",
  seedProducts
);

/* ===================================================== */
/* ================= GET ALL PRODUCTS ================== */
/* ===================================================== */

router.get(
  "/",
  getProducts
);

/* ===================================================== */
/* ================= GET SINGLE PRODUCT ================ */
/* ===================================================== */

router.get(
  "/:id",
  publicStore,
  getProductById
);

/* ===================================================== */
/* ================= CREATE PRODUCT ==================== */
/* ===================================================== */

router.post(
  "/",
  protect,
  admin,
  createProduct
);

/* ===================================================== */
/* ================= UPDATE PRODUCT ==================== */
/* ===================================================== */

router.put(
  "/:id",
  protect,
  admin,
  updateProduct
);

/* ===================================================== */
/* ================= DELETE PRODUCT ==================== */
/* ===================================================== */

router.delete(
  "/:id",
  protect,
  admin,
  deleteProduct
);


export default router;