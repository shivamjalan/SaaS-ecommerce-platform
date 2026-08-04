import {
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { handleRazorpayPayment } from "../utils/razorpay";
import { API_URL } from "../utils/api";
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

import { SectionLabel, Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

const statusSteps = [
  "Placed",
  "Packed",
  "Shipped",
  "Delivered",
];

const statusColors = {
  Placed: "bg-amber-100 text-amber-700",
  Packed: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-emerald-100 text-emerald-700",
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

  const fetchOrders = useCallback(async () => {

    try {

      const userInfo =
        JSON.parse(
          localStorage.getItem(
            "userInfo"
          )
        );

      const response =
        await fetch(
          `${API_URL}/orders/myorders`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

      if (!response.ok) {
        setOrders([]);
        console.log(
          `Failed to fetch orders: ${response.status}`
        );
        return;
      }

      const data =
        await response.json();

      setOrders(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchOrders();
    })();
  }, [fetchOrders]);

  /* ===================================================== */
  /* ================= CANCEL ORDER ====================== */
  /* ===================================================== */

  const cancelOrder = async (id) => {

    const confirmCancel =
      window.confirm(
        "Cancel this order? Stock will be returned to the store."
      );

    if (!confirmCancel) return;

    try {

      const userInfo =
        JSON.parse(
          localStorage.getItem(
            "userInfo"
          )
        );

      const response =
        await fetch(
          `${API_URL}/orders/${id}/cancel`,
          {
            method: "PUT",

            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to cancel order");
        return;
      }

      alert(data.message || "Order cancelled");

      await fetchOrders();

    } catch (error) {

      console.log(error);

      alert("Failed to cancel order");
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

  const retryPayment = async (order) => {
    await handleRazorpayPayment(
      order,
      null,
      navigate
    );
  };

  return (

    <div className="min-h-screen bg-background">

      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* ===================================================== */}
        {/* ==================== PAGE HEADER ==================== */}
        {/* ===================================================== */}

        <div className="flex items-center justify-between flex-wrap gap-4 mb-12">

          <div>

            <SectionLabel>

              Purchase History

            </SectionLabel>

            <h1 className="mt-4 text-5xl font-display text-foreground">

              My{" "}

              <span className="gradient-text">

                Orders

              </span>

            </h1>

          </div>

          <div className="bg-card border border-border shadow-md rounded-2xl px-8 py-5">

            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">

              Total Orders

            </p>

            <h2 className="mt-1 text-4xl font-display gradient-text">

              {orders.length}

            </h2>

          </div>

        </div>

        {/* ===================================================== */}
        {/* ==================== EMPTY STATE ==================== */}
        {/* ===================================================== */}

        {orders.length === 0 ? (

          <div className="bg-card border border-border rounded-[2rem] shadow-lg p-16 text-center">

            <div className="gradient-bg h-20 w-20 rounded-2xl mx-auto flex items-center justify-center shadow-accent mb-8">

              <FaBoxOpen
                className="text-white text-4xl"
              />

            </div>

            <h2 className="text-3xl font-display text-foreground mb-4">

              No Orders Yet

            </h2>

            <p className="text-muted-foreground text-lg">

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

                  className="bg-card border border-border rounded-[2rem] shadow-lg overflow-hidden"
                >

                  {/* ===================================================== */}
                  {/* ==================== ORDER TOP ====================== */}
                  {/* ===================================================== */}

                  <div className="relative bg-foreground text-background px-8 py-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    <div className="absolute inset-0 dot-pattern" />

                    <div className="relative">

                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50 mb-2">

                        Order ID

                      </p>

                      <h2 className="font-semibold break-all text-lg">

                        {order._id}

                      </h2>

                    </div>

                    <div className="relative">

                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50 mb-2">

                        Ordered On

                      </p>

                      <h3 className="font-semibold">

                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}

                      </h3>

                    </div>

                    <div className="relative">

                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50 mb-2">

                        Total Amount

                      </p>

                      <h3 className="text-3xl font-display gradient-text">

                        ₹
                        {order.totalPrice}

                      </h3>

                    </div>

                    <div className="relative flex flex-col gap-2">

                      <Badge
                        className={statusColors[order.status]}
                      >
                        {statusIcons[order.status]}
                        {order.status}
                      </Badge>

                      <Badge
                        className={
                          order.isPaid
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-orange-100 text-orange-700"
                        }
                      >
                        <FaMoneyBillWave />
                        {order.isPaid ? "Paid" : "Pending"}
                      </Badge>

                      <p className="text-sm text-white/60">
                        <span className="font-semibold text-white/80">Method:</span>{" "}
                        {order.paymentMethod}
                      </p>

                      {order.isPaid && (
                        <p className="text-sm text-white/60">
                          <span className="font-semibold text-white/80">Paid On:</span>{" "}
                          {new Date(order.paidAt).toLocaleString()}
                        </p>
                      )}

                    </div>

                  </div>

                  {/* ===================================================== */}
                  {/* ================= PROGRESS TRACKER ================== */}
                  {/* ===================================================== */}

                  <div className="px-8 py-8 border-b border-border">

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
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
                                completed
                                  ? "gradient-bg shadow-accent"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >

                              {completed ? "✓" : index + 1}

                            </div>

                            <p className={`mt-3 text-sm font-semibold ${
                              completed
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}>

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

                      <h3 className="text-xl font-semibold mb-4 text-foreground">

                        Shipping Address

                      </h3>

                      <div className="bg-muted rounded-2xl p-6 text-muted-foreground leading-relaxed">

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

                    {/* DELIVERY INFO */}

                    <div className="bg-muted rounded-2xl p-5 mb-8">

                      <h3 className="font-semibold text-lg mb-2 text-foreground">

                        Delivery Information

                      </h3>

                      {order.isDelivered ? (

                        <p className="text-muted-foreground">

                          Delivered on{" "}
                          {new Date(order.deliveredAt).toLocaleDateString()}

                        </p>

                      ) : (

                        <p className="text-muted-foreground">

                          Current Status:
                          <span className="font-semibold ml-2 text-foreground">

                            {order.status}

                          </span>

                        </p>

                      )}

                    </div>

                    {/* ITEMS */}

                    <div>

                      <h3 className="text-xl font-semibold mb-6 text-foreground">

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
                              className="flex gap-5 bg-muted rounded-2xl p-5 hover:shadow-lg transition"
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

                                <h4 className="text-lg font-semibold text-foreground mb-2">

                                  {
                                    item.name
                                  }

                                </h4>

                                <p className="text-muted-foreground mb-1">

                                  Quantity:
                                  {" "}
                                  {
                                    item.quantity
                                  }

                                </p>

                                <p className="text-2xl font-bold gradient-text">

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

                    {/* SUMMARY */}

                    <div className="mt-10 bg-muted rounded-2xl p-6">

                      <h3 className="text-xl font-semibold mb-5 text-foreground">

                        Order Summary

                      </h3>

                      <div className="flex justify-between mb-3 text-muted-foreground">

                        <span>Total Items</span>

                        <span className="text-foreground">{order.orderItems.length}</span>

                      </div>

                      <div className="flex justify-between mb-3 text-muted-foreground">

                        <span>Total Amount</span>

                        <span className="font-semibold text-foreground">₹{order.totalPrice}</span>

                      </div>

                      <div className="flex justify-between mb-3 text-muted-foreground">

                        <span>Payment Status</span>
                        <span className="text-foreground">{order.isPaid ? "Paid" : "Pending"}</span>
                      </div>

                      <div className="flex justify-between mb-3 text-muted-foreground">

                        <span>Payment Method</span>
                        <span className="text-foreground">{order.paymentMethod}</span>
                      </div>

                      {order.isPaid && (
                        <div className="flex justify-between text-muted-foreground">
                          <span>Paid On</span>
                          <span className="text-foreground">
                            {new Date(order.paidAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {!order.isPaid && order.paymentMethod === "Razorpay" && (
                        <Button
                          onClick={() => retryPayment(order)}
                          className="mt-6 w-full"
                        >
                          Retry Payment
                        </Button>
                      )}

                    </div>

                    {/* CANCEL ACTION */}

                    {!order.isDelivered &&
                      order.status !== "Cancelled" &&
                      order.status !== "Delivered" && (
                        <div className="mt-6">

                          <Button
                            onClick={() => cancelOrder(order._id)}
                            variant="danger"
                          >

                            <FaTimesCircle />

                            Cancel Order

                          </Button>

                        </div>
                      )}

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
