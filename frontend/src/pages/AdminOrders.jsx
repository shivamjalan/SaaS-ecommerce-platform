import {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  FaTruck,
  FaBoxOpen,
  FaTimesCircle,
  FaMoneyBillWave,
} from "react-icons/fa";

import { API_URL } from "../utils/api";

const AdminOrders = () => {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  /* ===================================================== */
  /* ================= FETCH ALL ORDERS ================== */
  /* ===================================================== */

  const fetchOrders = async () => {

    try {

      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      const response = await fetch(
        `${API_URL}/orders`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      const data = await response.json();

      setOrders(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    const loadOrders = async () => {

      await fetchOrders();

    };

    loadOrders();

  }, []);

  /* ===================================================== */
  /* =============== REUSABLE UPDATE API ================= */
  /* ===================================================== */

  const updateOrder = async (
    id,
    endpoint,
    body = null
  ) => {

    try {

      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      const response = await fetch(

        `${API_URL}/orders/${id}/${endpoint}`,

        {

          method: "PUT",

          headers: {

            Authorization: `Bearer ${userInfo.token}`,

            "Content-Type": "application/json",

          },

          body: body
            ? JSON.stringify(body)
            : null,

        }

      );

      const data = await response.json();

      if (response.ok) {

        fetchOrders();

      } else {

        alert(data.error);

      }

    } catch (error) {

      console.log(error);

    }

  };

  /* ===================================================== */
  /* ==================== MARK PAID ====================== */
  /* ===================================================== */

  const markPaid = async (id) => {

    await updateOrder(id, "pay");

  };

  /* ===================================================== */
  /* ================= MARK DELIVERED ==================== */
  /* ===================================================== */

  const markDelivered = async (
    id
  ) => {

    await updateOrder(id, "deliver");

  };

  /* ===================================================== */
  /* ================= CANCEL ORDER ====================== */
  /* ===================================================== */

  const cancelOrder = async (
    id
  ) => {

    const confirmCancel =
      window.confirm(
        "Cancel this order?"
      );

    if (!confirmCancel) return;

    await updateOrder(
      id,
      "cancel"
    );

  };

  /* ===================================================== */
  /* ============== UPDATE ORDER STATUS ================== */
  /* ===================================================== */

  const updateStatus = async (

    id,

    status

  ) => {

    await updateOrder(

      id,

      "status",

      {

        status,

      }

    );

  };

  /* ===================================================== */
  /* ================= STATUS BADGE ====================== */
  /* ===================================================== */

  const getStatusColor = (

    status

  ) => {

    switch (status) {

      case "Placed":

        return "bg-blue-100 text-blue-700";

      case "Packed":

        return "bg-orange-100 text-orange-700";

      case "Shipped":

        return "bg-purple-100 text-purple-700";

      case "Delivered":

        return "bg-green-100 text-green-700";

      case "Cancelled":

        return "bg-red-100 text-red-700";

      default:

        return "bg-gray-100 text-gray-700";

    }

  };
  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">

        <h1 className="text-3xl font-bold">

          Loading Orders...

        </h1>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-b from-[#faf7f2] via-white to-[#f8f5f0]">

      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* ===================================================== */}
        {/* ===================== HEADER ======================== */}
        {/* ===================================================== */}

        <div className="flex items-center justify-between flex-wrap gap-4 mb-12">

          <div>

            <p className="uppercase tracking-[5px] text-rose-500 font-semibold mb-3">

              Superadmin Dashboard

            </p>

            <h1 className="text-5xl font-bold text-gray-900">

              Manage Orders

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

              No Orders Found

            </h2>

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
                  {/* ================= ORDER HEADER ====================== */}
                  {/* ===================================================== */}

                  <div className="bg-black text-white px-8 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    {/* USER */}

                    <div>

                      <p className="text-sm text-gray-300 mb-2">

                        Customer

                      </p>

                      <h2 className="text-xl font-bold">

                        {order.user?.name}

                      </h2>

                      <p className="text-gray-400">

                        {order.user?.email}

                      </p>

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

                    {/* PAYMENT */}

<div>

  <p className="text-sm text-gray-300 mb-2">

    Payment

  </p>

  <div
    className={`px-5 py-3 rounded-xl font-semibold ${
      order.isPaid
        ? "bg-green-500/20 text-green-300"
        : "bg-red-500/20 text-red-300"
    }`}
  >

    {order.isPaid ? "Paid" : "Unpaid"}

  </div>

</div>

{/* ORDER STATUS */}

<div>

  <p className="text-sm text-gray-300 mb-2">

    Order Status

  </p>

  <div
    className={`px-5 py-3 rounded-xl font-semibold ${getStatusColor(
      order.status
    )}`}
  >

    {order.status}

  </div>

</div>

                  </div>

                  {/* ===================================================== */}
                  {/* ===================== BODY ========================== */}
                  {/* ===================================================== */}

                  <div className="p-8">

                    {/* SHIPPING */}

                    <div className="mb-10">

                      <h3 className="text-2xl font-bold mb-4">

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

                    {/* ORDER ITEMS */}

                    <div>

                      <h3 className="text-2xl font-bold mb-6">

                        Ordered Items

                      </h3>

                      <div className="grid md:grid-cols-2 gap-6">

                        {order.orderItems.map(
                          (
                            item,
                            idx
                          ) => (

                            <div
                              key={idx}
                              className="flex gap-5 bg-gray-50 rounded-2xl p-5"
                            >

                              <img
                                src={
                                  item.image
                                }
                                alt={
                                  item.name
                                }
                                className="w-28 h-28 object-cover rounded-2xl"
                              />

                              <div className="flex flex-col justify-center">

                                <h4 className="text-xl font-bold mb-2">

                                  {
                                    item.name
                                  }

                                </h4>

                                <p className="text-gray-500">

                                  Quantity:
                                  {" "}
                                  {
                                    item.quantity
                                  }

                                </p>

                                <p className="text-rose-500 text-2xl font-bold mt-2">

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

                    {/* ===================================================== */}
                    {/* ================= DELIVERY BUTTON ================== */}
                    {/* ===================================================== */}

                    {/* ACTIONS */}

<div className="mt-10 flex flex-wrap gap-4">

  {/* MARK PAID */}

  {!order.isPaid && (

    <button
      onClick={() =>
        markPaid(order._id)
      }
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition"
    >

      <FaMoneyBillWave />

      Mark Paid

    </button>

  )}

  {/* STATUS DROPDOWN */}

  {order.status !== "Cancelled" && (

    <select
      value={order.status}
      onChange={(e) =>
        updateStatus(
          order._id,
          e.target.value
        )
      }
      className="border rounded-xl px-5 py-3 font-semibold"
    >

      <option value="Placed">
        Placed
      </option>

      <option value="Packed">
        Packed
      </option>

      <option value="Shipped">
        Shipped
      </option>

      <option value="Delivered">
        Delivered
      </option>

    </select>

  )}

  {/* MARK DELIVERED */}

  {!order.isDelivered &&
    order.status !== "Cancelled" && (

      <button
        onClick={() =>
          markDelivered(order._id)
        }
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition"
      >

        <FaTruck />

        Mark Delivered

      </button>

    )}

  {/* CANCEL */}

  {order.status !== "Cancelled" &&
    order.status !== "Delivered" && (

      <button
        onClick={() =>
          cancelOrder(order._id)
        }
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition"
      >

        <FaTimesCircle />

        Cancel Order

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

export default AdminOrders;