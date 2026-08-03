import express from "express";

import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

import {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  markOrderPaid,
  updateOrderStatus,
  cancelOrder,
  markOrderDelivered,
} from "../controllers/orderController.js";

const router = express.Router();

/* ===================================================== */
/* ==================== PLACE ORDER ==================== */
/* ===================================================== */

router.post(
  "/",
  protect,
  placeOrder
);

/* ===================================================== */
/* ================= GET MY ORDERS ===================== */
/* ===================================================== */

router.get(
  "/myorders",
  protect,
  getMyOrders
);

/* ===================================================== */
/* =================== GET ORDER ======================= */
/* ===================================================== */

router.get(
  "/:id",
  protect,
  getOrderById
);

/* ===================================================== */
/* ================= ADMIN GET ALL ORDERS ============== */
/* ===================================================== */

router.get(
  "/",
  protect,
  admin,
  getAllOrders
);

/* ===================================================== */
/* ================== MARK ORDER PAID ================== */
/* ===================================================== */

router.put(
  "/:id/pay",
  protect,
  admin,
  markOrderPaid
);

/* ===================================================== */
/* =============== UPDATE ORDER STATUS ================= */
/* ===================================================== */

router.put(
  "/:id/status",
  protect,
  admin,
  updateOrderStatus
);

/* ===================================================== */
/* =================== CANCEL ORDER ==================== */
/* ===================================================== */

router.put(
  "/:id/cancel",
  protect,
  cancelOrder
);

/* ===================================================== */
/* ============== MARK ORDER DELIVERED ================= */
/* ===================================================== */

router.put(
  "/:id/deliver",
  protect,
  admin,
  markOrderDelivered
);

export default router;