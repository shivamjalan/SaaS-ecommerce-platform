import Order from "../models/Order.js";
import Product from "../models/Product.js";
/* ===================================================== */
/* ==================== PLACE ORDER ==================== */

export const placeOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        error: "No order items",
      });
    }

    
const firstProduct = await Product.findById(orderItems[0].product);

if (!firstProduct) {
    return res.status(404).json({
        error: "Product not found",
    });
}

const store = firstProduct.store;
const products = await Product.find({
  _id: { $in: orderItems.map(item => item.product) }
});
if (products.length !== orderItems.length) {
    return res.status(400).json({
        error: "One or more products are invalid",
    });
}
const sameStore = products.every(
  product => product.store.toString() === store.toString()
);

if (!sameStore) {
  return res.status(400).json({
    error: "All products must belong to the same store",
  });
}

// Build order items server-side from DB prices
const sanitizedItems = orderItems.map((item) => {

  const product = products.find(
    p => p._id.toString() === item.product
  );

  const quantity = Number(item.quantity);

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Invalid quantity");
  }

  return {
    name: product.name,
    quantity,
    image: product.image,
    price: product.price,
    product: product._id,
  };
});

// Recompute total server-side (subtotal + 5% GST)
const subtotal = sanitizedItems.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

const totalPrice = Math.round(subtotal * 1.05);

    const order = new Order({
      user: req.user._id,
      store,
      orderItems: sanitizedItems,
      shippingAddress,
      totalPrice,
      paymentMethod,
    });
    const createdOrder = await order.save();
    

    return res.status(201).json({
      message: "Order placed successfully",
      order: createdOrder,
    });

  } catch (error) {

    console.log(error);

    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: error.message || "Server error",
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
})
.populate("store", "name slug logo")
.sort({ createdAt: -1 })
.lean();

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

    const query = req.store
      ? { store: req.store._id }
      : {};

    const orders = await Order.find(query)
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

    const order = await Order.findOne(
      {
    _id: req.params.id,
    ...(req.store && {
      store: req.store._id,
    }),
}
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

    const order = await Order.findOne({
    _id: req.params.id,
    ...(req.store && {
      store: req.store._id,
    }),
});

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

    const order = await Order.findOne({
    _id: req.params.id,
    ...(req.store && {
      store: req.store._id,
    }),
});

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

    const order = await Order.findOne({
    _id: req.params.id,
    ...(req.store && {
      store: req.store._id,
    }),
});

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