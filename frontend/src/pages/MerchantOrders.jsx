import { useEffect, useState } from "react";

import {
  FaRupeeSign,
  FaCheckCircle,
  FaHourglassHalf,
  FaTruck,
  FaBox,
  FaTimesCircle,
} from "react-icons/fa";

import { API_URL } from "../utils/api";

const statusOptions = [
  "Placed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const statusIcon = (status) => {

  switch (status) {

    case "Delivered":
      return <FaCheckCircle className="text-green-500" />;

    case "Shipped":
      return <FaTruck className="text-blue-500" />;

    case "Packed":
      return <FaBox className="text-purple-500" />;

    case "Cancelled":
      return <FaTimesCircle className="text-red-500" />;

    default:
      return <FaHourglassHalf className="text-orange-500" />;

  }

};

const MerchantOrders = () => {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState(null);

  /* ===================================================== */
  /* ================== FETCH ORDERS ===================== */
  /* ===================================================== */

  const fetchOrders = async () => {

    try {

      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      const response = await fetch(
        `${API_URL}/merchant/orders`,
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

      alert("Failed to load orders");

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

  useEffect(() => {

    const loadOrders = async () => {

      await fetchOrders();

    };

    loadOrders();

  }, []);

  /* ===================================================== */
  /* ================= UPDATE STATUS ===================== */
  /* ===================================================== */

  const handleStatusChange = async (
    orderId,
    status
  ) => {

    try {

      setUpdating(orderId);

      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      const response = await fetch(
        `${API_URL}/merchant/orders/${orderId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },

          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to update status");
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? data.order
            : order
        )
      );

    } catch (error) {

      console.log(error);

      alert("Failed to update status");

    } finally {

      setUpdating(null);

    }

  };

  /* ===================================================== */
  /* ================= MARK DELIVERED ==================== */
  /* ===================================================== */

  const handleDeliver = async (orderId) => {

    try {

      setUpdating(orderId);

      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      const response = await fetch(
        `${API_URL}/merchant/orders/${orderId}/deliver`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to mark delivered");
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? data.order
            : order
        )
      );

    } catch (error) {

      console.log(error);

      alert("Failed to mark delivered");

    } finally {

      setUpdating(null);

    }

  };

  /* ===================================================== */
  /* ==================== LOADING ======================== */
  /* ===================================================== */

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

        <div className="mb-12">

          <p className="uppercase tracking-[5px] text-rose-500 font-semibold mb-3">

            Merchant

          </p>

          <h1 className="text-5xl font-bold text-gray-900">

            Orders

          </h1>

        </div>

        {orders.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-xl p-16 text-center">

            <p className="text-2xl font-bold text-gray-700 mb-2">

              No orders yet

            </p>

            <p className="text-gray-500">

              When customers order from your store, they will show up here.

            </p>

          </div>

        ) : (

          <div className="space-y-8">

            {orders.map((order) => (

              <div
                key={order._id}
                className="bg-white rounded-3xl shadow-xl p-8"
              >

                {/* ORDER HEADER */}

                <div className="flex items-center justify-between flex-wrap gap-4 mb-6">

                  <div>

                    <p className="font-bold text-lg">

                      Order #{order._id.slice(-6)}

                    </p>

                    <p className="text-gray-500 text-sm">

                      {new Date(order.createdAt).toLocaleDateString()}

                      {" "}·{" "}

                      {new Date(order.createdAt).toLocaleTimeString()}

                    </p>

                  </div>

                  <div className="flex items-center gap-2 font-bold text-rose-500 text-lg">

                    <FaRupeeSign />

                    {order.totalPrice}

                  </div>

                </div>

                {/* CUSTOMER */}

                <div className="mb-6">

                  <p className="text-gray-500 text-sm mb-1">

                    Customer

                  </p>

                  <p className="font-semibold">

                    {order.user?.name}

                  </p>

                  <p className="text-gray-500 text-sm">

                    {order.user?.email}

                  </p>

                  {order.shippingAddress && (

                    <p className="text-gray-500 text-sm mt-1">

                      {order.shippingAddress.address},

                      {" "}{order.shippingAddress.city},

                      {" "}{order.shippingAddress.postalCode},

                      {" "}{order.shippingAddress.country}

                    </p>
                  )}

                </div>

                {/* ITEMS */}

                <div className="mb-6">

                  <p className="text-gray-500 text-sm mb-3">

                    Items

                  </p>

                  <div className="space-y-2">

                    {order.orderItems.map((item) => (

                      <div
                        key={item._id}
                        className="flex items-center gap-4"
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />

                        <p className="font-semibold flex-1">

                          {item.name}

                        </p>

                        <p className="text-gray-500 text-sm">

                          {item.quantity} × ₹{item.price}

                        </p>

                      </div>
                    ))}

                  </div>

                </div>

                {/* STATUS CONTROLS */}

                <div className="flex items-center justify-between flex-wrap gap-4 border-t pt-6">

                  <div className="flex items-center gap-2 font-semibold">

                    {statusIcon(order.status)}

                    <span>{order.status}</span>

                  </div>

                  <div className="flex items-center gap-3">

                    <select
                      value={order.status}
                      disabled={updating === order._id}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="border px-4 py-2 rounded font-semibold bg-white"
                    >

                      {statusOptions.map((status) => (

                        <option
                          key={status}
                          value={status}
                        >

                          {status}

                        </option>
                      ))}

                    </select>

                    {order.status !== "Delivered" &&

                      order.status !== "Cancelled" && (

                      <button
                        onClick={() => handleDeliver(order._id)}
                        disabled={updating === order._id}
                        className="bg-green-500 text-white px-4 py-2 rounded font-semibold hover:bg-green-600 transition"
                      >

                        {updating === order._id
                          ? "Updating..."
                          : "Mark Delivered"}

                      </button>
                    )}

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default MerchantOrders;
