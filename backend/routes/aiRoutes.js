import express from "express";

import protect from "../middleware/authMiddleware.js";
import merchant from "../middleware/merchantMiddleware.js";
import adminOrMerchant from "../middleware/adminOrMerchant.js";
import { merchantStore } from "../middleware/storeMiddleware.js";

import {
  generateProductDescription,
  generateSalesInsights,
  chatReply,
} from "../controllers/aiController.js";

const router = express.Router();

/* ===================================================== */
/* ============= AI PRODUCT DESCRIPTION ================ */
/* ===================================================== */

router.post(
  "/product-description",
  protect,
  adminOrMerchant,
  merchantStore,
  generateProductDescription
);

/* ===================================================== */
/* =============== AI SALES INSIGHTS =================== */
/* ===================================================== */

router.post(
  "/sales-insights",
  protect,
  merchant,
  merchantStore,
  generateSalesInsights
);

/* ===================================================== */
/* ============== CUSTOMER SUPPORT CHAT ================ */
/* ===================================================== */

router.post(
  "/chat",
  chatReply
);

export default router;
