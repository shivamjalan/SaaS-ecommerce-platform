import express from "express";
import {createStore,getAllStores, getStoreBySlug, getMyStore, updateMyStore,} from "../controllers/storeController.js";
import protect from "../middleware/authMiddleware.js";
import merchant from "../middleware/merchantMiddleware.js";
import { getStoreProducts,} from "../controllers/productController.js";
const router = express.Router();

/* Public Routes */
router.get("/", getAllStores);

/* Merchant Routes (must be declared before /:slug) */
router.get("/me", protect, merchant, getMyStore);

router.put("/me", protect, merchant, updateMyStore);

router.get("/:slug", getStoreBySlug);

/* Merchant Route */
router.post("/", protect, createStore);

export default router;
