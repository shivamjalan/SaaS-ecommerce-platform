import express from "express";
import { createRazorpayOrder } from "../controllers/paymentController.js";
import {verifyPayment,} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-order", createRazorpayOrder);
router.post("/verify", verifyPayment);

export default router;