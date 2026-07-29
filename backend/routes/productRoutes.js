import express from "express";

import protect from "../middleware/authMiddleware.js";
import publicStore from "../middleware/publicStoreMiddleware.js";
import merchant from "../middleware/merchantMiddleware.js";
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
  publicStore,
  getProductById
);

/* ===================================================== */
/* ================= CREATE PRODUCT ==================== */
/* ===================================================== */

router.post(
  "/",
  protect,
  merchant,merchantStore,
  createProduct
);

/* ===================================================== */
/* ================= UPDATE PRODUCT ==================== */
/* ===================================================== */

router.put(
  "/:id",
  protect,
  merchant,merchantStore,
  updateProduct
);

/* ===================================================== */
/* ================= DELETE PRODUCT ==================== */
/* ===================================================== */

router.delete(
  "/:id",
  protect,
  merchant,merchantStore,
  deleteProduct
);


export default router;