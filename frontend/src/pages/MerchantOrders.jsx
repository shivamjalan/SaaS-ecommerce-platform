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

import { Button } from "../components/ui/button";
import { SectionLabel, Badge } from "../components/ui/badge";

const statusOptions = [
  "Placed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const statusBadgeColors = {
  Placed: "bg-amber-100 text-amber-700",
  Packed: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

const statusIcon = (status) => {

  switch (status) {

    case "Delivered":
      return <FaCheckCircle className="text-emerald-600" />;

    case "Shipped":
      return <FaTruck className="text-blue-600" />;

    case "Packed":
      return <FaBox className="text-purple-600" />;

    case "Cancelled":
      return <FaTimesCircle className="text-red-600" />;

    default:
      return <FaHourglassHalf className="text-amber-600" />;

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

      <div className="min-h-screen flex items-center justify-center bg-background">

        <div className="flex flex-col items-center gap-4">

          <div className="h-12 w-12 rounded-full border-2 border-border border-t-accent animate-spin" />

          <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">

            Loading Orders...

          </p>

        </div>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-background">

      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* ===================================================== */}
        {/* ==================== PAGE HEADER ==================== */}
        {/* ===================================================== */}

        <div className="mb-12">

          <SectionLabel>

            Merchant

          </SectionLabel>

          <h1 className="mt-4 text-5xl font-display text-foreground">

            Order

            <span className="gradient-text">

              {" "}Management

            </span>

          </h1>

        </div>

        {orders.length === 0 ? (

          <div className="bg-card border border-border rounded-[2rem] shadow-lg p-16 text-center">

            <div className="gradient-bg h-20 w-20 rounded-2xl mx-auto flex items-center justify-center shadow-accent mb-8">

              <FaBox className="text-white text-4xl" />

            </div>

            <h2 className="text-3xl font-display text-foreground mb-4">

              No Orders Yet

            </h2>

            <p className="text-muted-foreground text-lg">

              When customers order from your store, they will show up here.

            </p>

          </div>

        ) : (

          <div className="space-y-8">

            {orders.map((order) => (

              <div
                key={order._id}
                className="bg-card border border-border rounded-[2rem] shadow-lg overflow-hidden"
              >

                {/* ===================================================== */}
                {/* ==================== ORDER HEADER ================== */}
                {/* ===================================================== */}

                <div className="flex items-center justify-between flex-wrap gap-4 px-8 py-6 border-b border-border">

                  <div>

                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">

                      Order ID

                    </p>

                    <p className="font-mono font-semibold text-lg text-foreground">

                      #{order._id.slice(-6)}

                    </p>

                    <p className="text-muted-foreground text-sm mt-1">

                      {new Date(order.createdAt).toLocaleDateString()}

                      {" "}·{" "}

                      {new Date(order.createdAt).toLocaleTimeString()}

                    </p>

                  </div>

                  <div className="flex items-center gap-2 font-display text-3xl gradient-text">

                    <FaRupeeSign />

                    {order.totalPrice}

                  </div>

                </div>

                {/* ===================================================== */}
                {/* ====================== CUSTOMER ==================== */}
                {/* ===================================================== */}

                <div className="px-8 py-6 border-b border-border">

                  <div className="bg-muted rounded-2xl p-6">

                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">

                      Customer

                    </p>

                    <p className="font-semibold text-foreground">

                      {order.user?.name}

                    </p>

                    <p className="text-muted-foreground text-sm">

                      {order.user?.email}

                    </p>

                    {order.shippingAddress && (

                      <p className="text-muted-foreground text-sm mt-2">

                        {order.shippingAddress.address},

                        {" "}{order.shippingAddress.city},

                        {" "}{order.shippingAddress.postalCode},

                        {" "}{order.shippingAddress.country}

                      </p>
                    )}

                  </div>

                </div>

                {/* ===================================================== */}
                {/* ======================== ITEMS ====================== */}
                {/* ===================================================== */}

                <div className="px-8 py-6 border-b border-border">

                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-4">

                    Items

                  </p>

                  <div className="space-y-3">

                    {order.orderItems.map((item) => (

                      <div
                        key={item._id}
                        className="flex items-center gap-4 bg-muted rounded-2xl p-3"
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-xl"
                        />

                        <p className="font-semibold flex-1 text-foreground">

                          {item.name}

                        </p>

                        <p className="text-muted-foreground text-sm">

                          {item.quantity} ×{" "}

                          <span className="font-semibold gradient-text">

                            ₹{item.price}

                          </span>

                        </p>

                      </div>
                    ))}

                  </div>

                </div>

                {/* ===================================================== */}
                {/* =================== STATUS CONTROLS ================= */}
                {/* ===================================================== */}

                <div className="flex items-center justify-between flex-wrap gap-4 px-8 py-6">

                  <div className="flex items-center gap-2 font-semibold">

                    <Badge
                      className={
                        statusBadgeColors[order.status] ||
                        "bg-gray-100 text-gray-700"
                      }
                    >

                      {statusIcon(order.status)}

                      {order.status}

                    </Badge>

                  </div>

                  <div className="flex items-center gap-3">

                    <select
                      value={order.status}
                      disabled={updating === order._id}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="rounded-xl border border-border px-4 py-2 bg-card text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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

                      <Button
                        onClick={() => handleDeliver(order._id)}
                        disabled={updating === order._id}
                        variant="primary"
                        size="sm"
                      >

                        {updating === order._id
                          ? "Updating..."
                          : "Mark Delivered"}

                      </Button>
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
