import express from "express";
import { createStore } from "../controllers/storeController.js";
import  protect  from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createStore);

export default router;