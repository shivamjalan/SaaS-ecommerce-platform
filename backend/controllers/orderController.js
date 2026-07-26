import Order from "../models/Order.js";

/* ===================================================== */
/* ==================== PLACE ORDER ==================== */
/* ===================================================== */

export const placeOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      totalPrice,
      paymentMethod,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        error: "No order items",
      });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      totalPrice,
      paymentMethod,
    });

    const createdOrder = await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: createdOrder,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error",
    });

  }
};

/* ===================================================== */
/* ================= GET MY ORDERS ===================== */
/* ===================================================== */

export const getMyOrders = async (req, res) => {

  try {

    const orders = await Order.find({
      user: req.user._id,
    });

    res.json(orders);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error",
    });

  }

};

/* ===================================================== */
/* ==================== GET ORDER ====================== */
/* ===================================================== */

export const getOrderById = async (req, res) => {

  try {

    const order = await Order.findById(
      req.params.id
    ).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    res.json(order);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error",
    });

  }

};

/* ===================================================== */
/* ==================== GET ALL ORDERS ================= */
/* ===================================================== */

export const getAllOrders = async (req, res) => {

  try {

    const orders = await Order.find({})
      .populate(
        "user",
        "id name email"
      )
      .sort({
        createdAt: -1,
      });

    res.json(orders);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error",
    });

  }

};

/* ===================================================== */
/* ================== MARK ORDER PAID ================== */
/* ===================================================== */

export const markOrderPaid = async (
  req,
  res
) => {

  try {

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();

    res.json({
      message: "Order marked as paid",
      order: updatedOrder,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error",
    });

  }

};

/* ===================================================== */
/* ================= UPDATE ORDER STATUS =============== */
/* ===================================================== */

export const updateOrderStatus = async (
  req,
  res
) => {

  try {

    const { status } = req.body;

    const allowedStatus = [
      "Placed",
      "Packed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        error: "Invalid status",
      });
    }

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    order.status = status;

    if (status === "Delivered") {

      order.isDelivered = true;
      order.deliveredAt = Date.now();

    }

    const updatedOrder = await order.save();

    res.json({
      message: "Order status updated",
      order: updatedOrder,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error",
    });

  }

};

/* ===================================================== */
/* =================== CANCEL ORDER ==================== */
/* ===================================================== */

export const cancelOrder = async (
  req,
  res
) => {

  try {

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    order.status = "Cancelled";

    const updatedOrder = await order.save();

    res.json({
      message: "Order cancelled successfully",
      order: updatedOrder,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error",
    });

  }

};

/* ===================================================== */
/* ============== MARK ORDER DELIVERED ================= */
/* ===================================================== */

export const markOrderDelivered = async (
  req,
  res
) => {

  try {

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = "Delivered";

    const updatedOrder = await order.save();

    res.json({
      message: "Order marked as delivered",
      order: updatedOrder,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error",
    });

  }

};