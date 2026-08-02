import express from "express";

import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";
import { getStoreProducts } from "../controllers/productController.js";
import { merchantStore } from "../middleware/storeMiddleware.js";
import {
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
  getProductRecommendations,
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
/* ============ GET STORE PRODUCTS (by slug) =========== */
/* ===================================================== */

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
/* ============= GET PRODUCT RECOMMENDATIONS =========== */
/* ===================================================== */

router.get(
  "/:id/recommendations",
  getProductRecommendations
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