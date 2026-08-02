import express from "express";

import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";
import { getStoreProducts } from "../controllers/productController.js";
import { merchantStore } from "../middleware/storeMiddleware.js";
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
  protect,
  admin,
  seedProducts
);

/* ===================================================== */
/* ================= GET ALL PRODUCTS ================== */
/* ===================================================== */

router.get(
  "/",
  getProducts
);

router.get(
    "/store/:slug",
    getStoreProducts
);

/* ===================================================== */
/* ================= GET SINGLE PRODUCT ================ */
/* ===================================================== */

router.get(
  "/:id",
  getProductById
);

/* ===================================================== */
/* ================= CREATE PRODUCT ==================== */
/* ===================================================== */

router.post(
  "/",
  protect,
  merchantStore,
  createProduct
);

/* ===================================================== */
/* ================= UPDATE PRODUCT ==================== */
/* ===================================================== */

router.put(
  "/:id",
  protect,
  merchantStore,
  updateProduct
);

/* ===================================================== */
/* ================= DELETE PRODUCT ==================== */
/* ===================================================== */

router.delete(
  "/:id",
  protect,
  merchantStore,
  deleteProduct
);


export default router;