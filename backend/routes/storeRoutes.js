import express from "express";
import {createStore,getAllStores, getStoreBySlug,} from "../controllers/storeController.js";
import protect from "../middleware/authMiddleware.js";
import { getStoreProducts,} from "../controllers/productController.js";
const router = express.Router();

/* Public Routes */
router.get("/", getAllStores);

router.get("/:slug", getStoreBySlug);

/* Merchant Route */
router.post("/", protect, createStore);

export default router;