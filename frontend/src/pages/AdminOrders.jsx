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

import {
  API_URL,
  apiErrorMessage,
  getUserInfo,
} from "../utils/api";

import { SectionLabel, Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const AdminOrders = () => {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [storeFilter, setStoreFilter] = useState("all");

  /* ===================================================== */
  /* ================= FETCH ALL ORDERS ================== */
  /* ===================================================== */

  const fetchOrders = async () => {

    try {

      const userInfo = getUserInfo();

      if (!userInfo) {
        setOrders([]);
        return;
      }

      const response = await fetch(
        `${API_URL}/orders`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setOrders([]);

        alert(data.error || data.message || "Failed to load orders");

        return;

      }

      setOrders(Array.isArray(data) ? data : []);

    } catch (error) {

      console.error(error);

      setOrders([]);

      alert(apiErrorMessage());

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
  /* ============== STORE FILTER + STATS ================= */
  /* ===================================================== */

  const storeMap = {};

  orders.forEach((order) => {

    const store = order.store;

    if (store && typeof store === "object" && store._id) {

      storeMap[store._id] = store;

    }

  });

  const storeOptions = [
    { id: "all", name: "All Stores" },
    ...Object.values(storeMap).map((s) => ({
      id: s._id,
      name: s.name || s.slug,
    })),
  ];

  const filteredOrders =
    storeFilter === "all"
      ? orders
      : orders.filter(
          (order) =>
            (order.store?._id || order.store) ===
            storeFilter
        );

  const totalRevenue =
    orders
      .filter((order) => order.isPaid)
      .reduce((sum, order) => sum + order.totalPrice, 0);

  const unpaidCount =
    orders.filter((order) => !order.isPaid).length;

  const pendingCount =
    orders.filter(
      (order) =>
        !order.isDelivered &&
        order.status !== "Cancelled"
    ).length;

  /* ===================================================== */
  /* =============== REUSABLE UPDATE API ================= */
  /* ===================================================== */

  const updateOrder = async (
    id,
    endpoint,
    body = null
  ) => {

    try {

      const userInfo = getUserInfo();

      if (!userInfo) return;

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

        alert(data.error || data.message || "Request failed");

      }

    } catch (error) {

      console.error(error);

      alert(apiErrorMessage());

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
        {/* ===================== HEADER ======================== */}
        {/* ===================================================== */}

        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">

          <div>

            <SectionLabel>

              Superadmin Dashboard

            </SectionLabel>

            <h1 className="mt-4 text-5xl font-display text-foreground">

              Manage{" "}

              <span className="gradient-text">

                Orders

              </span>

            </h1>

            <p className="mt-3 text-muted-foreground max-w-xl">

              You're viewing orders across every store on the platform.

            </p>

          </div>

          <select
            value={storeFilter}
            onChange={(e) => setStoreFilter(e.target.value)}
            className="h-12 rounded-xl border border-border bg-card px-4 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >

            {storeOptions.map((option) => (
              <option
                key={option.id}
                value={option.id}
              >

                {option.name}

              </option>
            ))}

          </select>

        </div>

        {/* SUPERADMIN STATS */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">

          {[
            {
              label: "Total Orders",
              value: orders.length,
            },
            {
              label: "Total Revenue",
              value: `₹${totalRevenue}`,
            },
            {
              label: "Unpaid",
              value: unpaidCount,
            },
            {
              label: "Pending",
              value: pendingCount,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border shadow-md rounded-2xl px-6 py-5"
            >

              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">

                {stat.label}

              </p>

              <h2 className="mt-1 text-3xl font-display gradient-text">

                {stat.value}

              </h2>

            </div>
          ))}

        </div>

        {/* ===================================================== */}
        {/* ==================== EMPTY STATE ==================== */}
        {/* ===================================================== */}

        {orders.length === 0 ? (

          <Card className="p-16 text-center">

            <div className="gradient-bg h-20 w-20 rounded-2xl mx-auto flex items-center justify-center shadow-accent mb-8">

              <FaBoxOpen
                className="text-white text-4xl"
              />

            </div>

            <h2 className="text-3xl font-display text-foreground mb-4">

              No Orders Found

            </h2>

          </Card>

        ) : filteredOrders.length === 0 ? (

          <Card className="p-16 text-center">

            <h2 className="text-3xl font-display text-foreground mb-4">

              No Orders For This Store

            </h2>

            <p className="text-muted-foreground">

              Try a different store filter.

            </p>

          </Card>

        ) : (

          <div className="space-y-10">

            {filteredOrders.map(
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
                  {/* ================= ORDER HEADER ====================== */}
                  {/* ===================================================== */}

                  <div className="relative bg-foreground text-background px-8 py-6">

                    <div className="absolute inset-0 dot-pattern" />

                    <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                      {/* ORDER ID */}

                      <div>

                        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50 mb-2">

                          Order ID

                        </p>

                        <h3 className="font-semibold break-all text-lg">

                          {order._id}

                        </h3>

                      </div>

                      {/* STORE */}

                      <div>

                        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50 mb-2">

                          Store

                        </p>

                        <h3 className="font-semibold">

                          {order.store?.name || order.store}

                        </h3>

                      </div>

                      {/* CUSTOMER */}

                      <div>

                        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50 mb-2">

                          Customer

                        </p>

                        <h3 className="font-semibold">

                          {order.user?.name}

                        </h3>

                        <p className="text-sm text-white/60">

                          {order.user?.email}

                        </p>

                      </div>

                      {/* DATE */}

                      <div>

                        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50 mb-2">

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

                        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50 mb-2">

                          Total Amount

                        </p>

                        <h3 className="text-3xl font-display gradient-text">

                          ₹
                          {order.totalPrice}

                        </h3>

                      </div>

                      {/* PAYMENT + STATUS */}

                      <div className="flex flex-col gap-2">

                        <Badge
                          className={
                            order.isPaid
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-orange-100 text-orange-700"
                          }
                        >

                          <FaMoneyBillWave />

                          {order.isPaid ? "Paid" : "Unpaid"}

                        </Badge>

                        <Badge
                          className={getStatusColor(
                            order.status
                          )}
                        >

                          {order.status}

                        </Badge>

                      </div>

                    </div>

                  </div>

                  {/* ===================================================== */}
                  {/* ===================== BODY ========================== */}
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

                    {/* ORDER ITEMS */}

                    <div>

                      <h3 className="text-xl font-semibold mb-6 text-foreground">

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
                              className="flex gap-5 bg-muted rounded-2xl p-5"
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

                                <h4 className="text-lg font-semibold text-foreground mb-2">

                                  {
                                    item.name
                                  }

                                </h4>

                                <p className="text-muted-foreground">

                                  Quantity:
                                  {" "}
                                  {
                                    item.quantity
                                  }

                                </p>

                                <p className="text-2xl font-bold gradient-text mt-2">

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
                    {/* ===================== ACTIONS ======================= */}
                    {/* ===================================================== */}

                    <div className="mt-10 flex flex-wrap gap-4">

                      {/* MARK PAID */}

                      {!order.isPaid && (

                        <Button
                          onClick={() =>
                            markPaid(order._id)
                          }
                          variant="primary"
                        >

                          <FaMoneyBillWave />

                          Mark Paid

                        </Button>

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
                          className="h-12 rounded-xl border border-border bg-card px-4 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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

                          <Button
                            onClick={() =>
                              markDelivered(order._id)
                            }
                            variant="outline"
                          >

                            <FaTruck />

                            Mark Delivered

                          </Button>

                        )}

                      {/* CANCEL */}

                      {order.status !== "Cancelled" &&
                        order.status !== "Delivered" && (

                          <Button
                            onClick={() =>
                              cancelOrder(order._id)
                            }
                            variant="danger"
                          >

                            <FaTimesCircle />

                            Cancel Order

                          </Button>

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
