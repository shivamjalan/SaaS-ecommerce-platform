import Order from "../models/Order.js";
import Product from "../models/Product.js";
/* ===================================================== */
/* ==================== PLACE ORDER ==================== */

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
    const order = new Order({
      user: req.user._id,
      store,
      orderItems,
      shippingAddress,
      totalPrice,
      paymentMethod,
    });
const total = products.reduce(
    (sum, product) => {
        const item = orderItems.find(
            i => i.product === product._id.toString()
        );

        return sum + product.price * item.quantity;
    },
    0
);
    const createdOrder = await order.save();
    

    return res.status(201).json({
      message: "Order placed successfully",
      order: createdOrder,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
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

    const orders = await Order.find({store: req.store._id,})
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
    store: req.store._id,
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
    store: req.store._id,
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
    user: req.user._id,
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
    store: req.store._id,
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