import Order from "../models/Order.js";
import Product from "../models/Product.js";

/* ===================================================== */
/* ============== MERCHANT DASHBOARD =================== */
/* ===================================================== */

export const getMerchantDashboard = async (
  req,
  res
) => {

  try {

    const storeId = req.store._id;

    const [
      productCount,
      orderCount,
      revenueAgg,
      pendingCount,
      recentOrders,
    ] = await Promise.all([

      Product.countDocuments({
        store: storeId,
      }),

      Order.countDocuments({
        store: storeId,
      }),

      Order.aggregate([
        {
          $match: {
            store: storeId,
            isPaid: true,
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$totalPrice",
            },
          },
        },
      ]),

      Order.countDocuments({
        store: storeId,
        status: {
          $nin: ["Delivered", "Cancelled"],
        },
      }),

      Order.find({
        store: storeId,
      })
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),

    ]);

    res.json({
      productCount,
      orderCount,
      revenue: revenueAgg[0]?.total || 0,
      pendingCount,
      recentOrders,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message,
    });

  }

};

/* ===================================================== */
/* ============== MERCHANT CUSTOMERS =================== */
/* ===================================================== */

export const getMerchantCustomers = async (
  req,
  res
) => {

  try {

    const customers = await Order.aggregate([

      {
        $match: {
          store: req.store._id,
        },
      },

      {
        $group: {
          _id: "$user",
          orderCount: {
            $sum: 1,
          },
          totalSpent: {
            $sum: "$totalPrice",
          },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 1,
          name: "$user.name",
          email: "$user.email",
          orderCount: 1,
          totalSpent: 1,
        },
      },

      {
        $sort: {
          totalSpent: -1,
        },
      },

    ]);

    res.json(customers);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message,
    });

  }

};
