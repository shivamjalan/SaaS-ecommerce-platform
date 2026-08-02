import Order from "../models/Order.js";

/* ===================================================== */
/* =============== STORE ANALYTICS SERVICE ============= */
/* ===================================================== */

export const getStoreAnalytics = async (storeId) => {

  const thirtyDaysAgo = new Date();

  thirtyDaysAgo.setDate(
    thirtyDaysAgo.getDate() - 30
  );

  const [
    dailySales,
    topProducts,
    categoryRevenue,
    orderStatusBreakdown,
    totalRevenueAgg,
  ] = await Promise.all([

    // Last 30 days of paid sales
    Order.aggregate([
      {
        $match: {
          store: storeId,
          isPaid: true,
          createdAt: {
            $gte: thirtyDaysAgo,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          revenue: {
            $sum: "$totalPrice",
          },
          orders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          revenue: 1,
          orders: 1,
        },
      },
    ]),

    // Top products by revenue
    Order.aggregate([
      {
        $match: {
          store: storeId,
        },
      },
      {
        $unwind: "$orderItems",
      },
      {
        $group: {
          _id: "$orderItems.product",
          name: {
            $first: "$orderItems.name",
          },
          quantity: {
            $sum: "$orderItems.quantity",
          },
          revenue: {
            $sum: {
              $multiply: [
                "$orderItems.price",
                "$orderItems.quantity",
              ],
            },
          },
        },
      },
      {
        $sort: {
          revenue: -1,
        },
      },
      {
        $limit: 5,
      },
    ]),

    // Revenue by category
    Order.aggregate([
      {
        $match: {
          store: storeId,
          isPaid: true,
        },
      },
      {
        $unwind: "$orderItems",
      },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $unwind: {
          path: "$productInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "productInfo.category": {
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: "$productInfo.category",
          revenue: {
            $sum: {
              $multiply: [
                "$orderItems.price",
                "$orderItems.quantity",
              ],
            },
          },
        },
      },
      {
        $sort: {
          revenue: -1,
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          revenue: 1,
        },
      },
    ]),

    // Order status breakdown
    Order.aggregate([
      {
        $match: {
          store: storeId,
        },
      },
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ]),

    // Lifetime paid revenue
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

  ]);

  return {
    dailySales,
    topProducts,
    categoryRevenue,
    orderStatusBreakdown,
    totalRevenue: totalRevenueAgg[0]?.total || 0,
  };

};
