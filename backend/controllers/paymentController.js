import razorpay from "../config/razorpay.js";
import crypto from "node:crypto";
import Order from "../models/Order.js";

export const createRazorpayOrder = async (req, res) => {
    console.log(req.body);
  try {
    const { amount ,orderId} = req.body;

    const options = {
      amount: amount * 100, // Razorpay uses paise
      currency: "INR",
      receipt: orderId,
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (error) {
  console.error("RAZORPAY ERROR:", error);

  res.status(500).json({
    message: error.message,
    error,
  });
}
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // Generate expected signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Verify signature
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Find MongoDB order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Order must belong to the authenticated user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You do not own this order",
      });
    }

    if (order.isPaid) {
      return res.status(400).json({
        success: false,
        message: "Order already paid",
      });
    }

    // Update payment details
    order.isPaid = true;
    order.paidAt = new Date();

    order.razorpayOrderId = razorpay_order_id;
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;

    await order.save();

    res.json({
      success: true,
      message: "Payment verified successfully",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Verification failed",
      error: error.message,
    });
  }
};