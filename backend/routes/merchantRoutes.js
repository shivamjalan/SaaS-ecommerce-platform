import express from "express";

import protect from "../middleware/authMiddleware.js";
import merchant from "../middleware/merchantMiddleware.js";
import { merchantStore } from "../middleware/storeMiddleware.js";

import {
  getMerchantDashboard,
  getMerchantAnalytics,
  getMerchantCustomers,
} from "../controllers/merchantController.js";

import {
  getAllOrders,
  updateOrderStatus,
  markOrderDelivered,
} from "../controllers/orderController.js";

const router = express.Router();

/* ===================================================== */
/* =============== MERCHANT DASHBOARD ================== */
/* ===================================================== */

router.get(
  "/dashboard",
  protect,
  merchant,
  merchantStore,
  getMerchantDashboard
);

/* ===================================================== */
/* =============== MERCHANT ANALYTICS ================== */
/* ===================================================== */

router.get(
  "/analytics",
  protect,
  merchant,
  merchantStore,
  getMerchantAnalytics
);

/* ===================================================== */
/* =============== MERCHANT CUSTOMERS ================== */
/* ===================================================== */

router.get(
  "/customers",
  protect,
  merchant,
  merchantStore,
  getMerchantCustomers
);

/* ===================================================== */
/* ============== MERCHANT ORDER ROUTES ================ */
/* ===================================================== */

router.get(
  "/orders",
  protect,
  merchant,
  merchantStore,
  getAllOrders
);

router.put(
  "/orders/:id/status",
  protect,
  merchant,
  merchantStore,
  updateOrderStatus
);

router.put(
  "/orders/:id/deliver",
  protect,
  merchant,
  merchantStore,
  markOrderDelivered
);

export default router;
