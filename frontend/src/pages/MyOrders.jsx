import {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { handleRazorpayPayment } from "../utils/razorpay";
import { motion } from "framer-motion";

import {
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaBox,
  FaShippingFast,
  FaTimesCircle,
  FaMoneyBillWave,
} from "react-icons/fa";

const statusSteps = [
  "Placed",
  "Packed",
  "Shipped",
  "Delivered",
];

const statusColors = {
  Placed: "bg-yellow-100 text-yellow-700",
  Packed: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const statusIcons = {
  Placed: <FaClock />,
  Packed: <FaBox />,
  Shipped: <FaShippingFast />,
  Delivered: <FaCheckCircle />,
  Cancelled: <FaTimesCircle />,
};

const MyOrders = () => {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);
  const navigate = useNavigate();
  /* ===================================================== */
  /* ================= FETCH ORDERS ====================== */
  /* ===================================================== */

  useEffect(() => {

    const fetchOrders =
      async () => {

        try {

          const userInfo =
            JSON.parse(
              localStorage.getItem(
                "userInfo"
              )
            );

          const response =
            await fetch(
              "http://localhost:5000/api/orders/myorders",
              {
                headers: {
                  Authorization: `Bearer ${userInfo.token}`,
                },
              }
            );

          const data =
            await response.json();

          console.log(data);

          setOrders(data);

        } catch (error) {

          console.log(error);

        } finally {

          setLoading(false);

        }
      };

    fetchOrders();

  }, []);

  /* ===================================================== */
  /* ==================== LOADING ======================== */
  /* ===================================================== */

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">

        <div className="text-2xl font-semibold text-gray-700">

          Loading Orders...

        </div>

      </div>
    );  
  }
  const retryPayment = async (order) => {
    await handleRazorpayPayment(
    order,
    null,
    navigate
  );
};
  return (

    <div className="min-h-screen bg-gradient-to-b from-[#faf7f2] via-white to-[#f8f5f0]">

      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* ===================================================== */}
        {/* ==================== PAGE HEADER ==================== */}
        {/* ===================================================== */}

        <div className="flex items-center justify-between flex-wrap gap-4 mb-12">

          <div>

            <p className="uppercase tracking-[5px] text-rose-500 font-semibold mb-3">

              Purchase History

            </p>

            <h1 className="text-5xl font-bold text-gray-900">

              My Orders

            </h1>

          </div>

          <div className="bg-white shadow-lg rounded-2xl px-6 py-4">

            <p className="text-gray-500 text-sm">

              Total Orders

            </p>

            <h2 className="text-3xl font-bold text-rose-500">

              {orders.length}

            </h2>

          </div>

        </div>

        {/* ===================================================== */}
        {/* ==================== EMPTY STATE ==================== */}
        {/* ===================================================== */}

        {orders.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-xl p-16 text-center">

            <FaBoxOpen
              className="mx-auto text-6xl text-gray-300 mb-6"
            />

            <h2 className="text-3xl font-bold text-gray-800 mb-4">

              No Orders Yet

            </h2>

            <p className="text-gray-500 text-lg">

              Your purchased products will
              appear here.

            </p>

          </div>

        ) : (

          <div className="space-y-10">

            {orders.map(
              (order, index) => (

                <motion.div

                  key={order._id}

                  initial={{
                    opacity: 0,
                    y: 40,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    duration: 0.5,
                    delay:
                      index * 0.1,
                  }}

                  className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
                >

                  {/* ===================================================== */}
                  {/* ==================== ORDER TOP ====================== */}
                  {/* ===================================================== */}

                  <div className="bg-black text-white px-8 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    {/* ORDER INFO */}

                    <div>

                      <p className="text-sm text-gray-300 mb-2">

                        Order ID

                      </p>

                      <h2 className="font-semibold break-all text-lg">

                        {order._id}

                      </h2>

                    </div>

                    {/* DATE */}

                    <div>

                      <p className="text-sm text-gray-300 mb-2">

                        Ordered On

                      </p>

                      <h3 className="font-semibold">

                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}

                      </h3>

                    </div>

                    {/* TOTAL */}

                    <div>

                      <p className="text-sm text-gray-300 mb-2">

                        Total Amount

                      </p>

                      <h3 className="text-3xl font-bold text-rose-400">

                        ₹
                        {order.totalPrice}

                      </h3>

                    </div>

                    <div>
  <div>

  <div
    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold ${
      statusColors[order.status]
    }`}
  >
    {statusIcons[order.status]}
    {order.status}
  </div>

  <div
  className={`mt-3 px-4 py-2 rounded-xl font-medium ${
    order.isPaid
      ? "bg-green-100 text-green-700"
      : "bg-orange-100 text-orange-700"
  }`}
>
  <FaMoneyBillWave className="inline mr-2" />

  {order.isPaid ? "Paid" : "Pending"}
</div>
<p className="mt-2 text-sm text-gray-600">
  <span className="font-semibold">Method:</span>{" "}
  {order.paymentMethod}
</p>
{order.isPaid && (
  <p className="text-sm text-gray-600 mt-1">
    <span className="font-semibold">Paid On:</span>{" "}
    {new Date(order.paidAt).toLocaleString()}
  </p>
)}
</div>
</div>

                  </div>
                  
<div className="px-8 py-8 border-b">

  <div className="flex flex-col md:flex-row justify-between gap-6">

    {statusSteps.map((step, index) => {

      const current =
  order.status === "Cancelled"
    ? 0
    : statusSteps.indexOf(order.status);

      const completed = current >= index;

      return (

        <div
          key={step}
          className="flex flex-col items-center flex-1"
        >

          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold
            ${
              completed
                ? "bg-green-500"
                : "bg-gray-300"
            }`}
          >

            {completed ? "✓" : index + 1}

          </div>

          <p className="mt-3 text-sm font-semibold">

            {step}

          </p>

        </div>

      );

    })}

  </div>

</div>
                  {/* ===================================================== */}
                  {/* ==================== CONTENT ======================== */}
                  {/* ===================================================== */}

                  <div className="p-8">

                    {/* SHIPPING */}

                    <div className="mb-10">

                      <h3 className="text-2xl font-bold mb-4 text-gray-800">

                        Shipping Address

                      </h3>

                      <div className="bg-gray-50 rounded-2xl p-6 text-gray-600 leading-relaxed">

                        {
                          order
                            .shippingAddress
                            .address
                        }

                        ,{" "}

                        {
                          order
                            .shippingAddress
                            .city
                        }

                        ,{" "}

                        {
                          order
                            .shippingAddress
                            .postalCode
                        }

                        ,{" "}

                        {
                          order
                            .shippingAddress
                            .country
                        }

                      </div>

                    </div>
                    <div className="bg-green-50 rounded-2xl p-5 mb-8">

  <h3 className="font-bold text-lg mb-2">

    Delivery Information

  </h3>

  {order.isDelivered ? (

    <p>

      Delivered on{" "}
      {new Date(order.deliveredAt).toLocaleDateString()}

    </p>

  ) : (

    <p>

      Current Status:
      <span className="font-semibold ml-2">

        {order.status}

      </span>

    </p>

  )}

</div>
                    {/* ITEMS */}

                    <div>

                      <h3 className="text-2xl font-bold mb-6 text-gray-800">

                        Ordered Items

                      </h3>

                      <div className="grid md:grid-cols-2 gap-6">

                        {order.orderItems.map(
                          (
                            item,
                            itemIndex
                          ) => (

                            <div
                              key={
                                itemIndex
                              }
                              className="flex gap-5 bg-gray-50 rounded-2xl p-5 hover:shadow-lg transition"
                            >

                              {/* IMAGE */}

                              <img
                                src={
                                  item.image
                                }
                                alt={
                                  item.name
                                }
                                className="w-28 h-28 object-cover rounded-2xl"
                              />

                              {/* INFO */}

                              <div className="flex flex-col justify-center">

                                <h4 className="text-xl font-bold text-gray-900 mb-2">

                                  {
                                    item.name
                                  }

                                </h4>

                                <p className="text-gray-500 mb-1">

                                  Quantity:
                                  {" "}
                                  {
                                    item.quantity
                                  }

                                </p>

                                <p className="text-rose-500 text-2xl font-bold">

                                  ₹
                                  {
                                    item.price
                                  }

                                </p>

                              </div>

                            </div>
                          )
                        )}

                      </div>

                    </div>
                    <div className="mt-10 bg-gray-50 rounded-2xl p-6">

  <h3 className="text-xl font-bold mb-5">

    Order Summary

  </h3>

  <div className="flex justify-between mb-3">

    <span>Total Items</span>

    <span>{order.orderItems.length}</span>

  </div>

  <div className="flex justify-between mb-3">

    <span>Total Amount</span>

    <span>₹{order.totalPrice}</span>

  </div>

  <div className="flex justify-between mb-3">
  <span>Payment Status</span>
  <span>{order.isPaid ? "Paid" : "Pending"}</span>
</div>

<div className="flex justify-between mb-3">
  <span>Payment Method</span>
  <span>{order.paymentMethod}</span>
</div>

{order.isPaid && (
  <div className="flex justify-between">
    <span>Paid On</span>
    <span>
      {new Date(order.paidAt).toLocaleDateString()}
    </span>
  </div>
)}
{!order.isPaid && order.paymentMethod === "Razorpay" && (
  <button
    onClick={() => retryPayment(order)}
    className="mt-4 w-full bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-xl transition"
  >
    Retry Payment
  </button>
)}
</div>
                  </div>

                </motion.div>
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
};

export default MyOrders;