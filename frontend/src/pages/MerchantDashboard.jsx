import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  FaBoxOpen,
  FaClipboardList,
  FaRupeeSign,
  FaHourglassHalf,
  FaStore,
  FaChartLine,
  FaMagic,
  FaExclamationTriangle,
} from "react-icons/fa";

import { Button } from "../components/ui/button";

import { Card } from "../components/ui/card";

import { SectionLabel, Badge } from "../components/ui/badge";

import {
  API_URL,
  apiErrorMessage,
  getUserInfo,
} from "../utils/api";

const MerchantDashboard = () => {

  const [store, setStore] = useState(null);

  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

  const [insight, setInsight] = useState("");

  const [loadingInsight, setLoadingInsight] = useState(false);

  /* ===================================================== */
  /* ================== FETCH DASHBOARD ================== */
  /* ===================================================== */

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const userInfo = getUserInfo();

        if (!userInfo) {
          setStore(null);
          setStats(null);
          return;
        }

        const headers = {
          Authorization: `Bearer ${userInfo.token}`,
        };

        const [storeRes, statsRes] = await Promise.all([

          fetch(`${API_URL}/stores/me`, { headers }),

          fetch(`${API_URL}/merchant/dashboard`, { headers }),

        ]);

        const storeData = await storeRes.json();
        const statsData = await statsRes.json();

        setStore(storeRes.ok ? storeData : null);
        setStats(statsRes.ok && statsData && typeof statsData === "object" ? statsData : null);

      } catch (error) {

        console.error(error);

        setStore(null);

        setStats(null);

      } finally {

        setLoading(false);

      }

    };

    fetchDashboard();

  }, []);

  /* ===================================================== */
  /* ================ GENERATE AI SUMMARY ================ */
  /* ===================================================== */

  const generateInsight = async () => {

    try {

      setLoadingInsight(true);

      setInsight("");

      const userInfo = getUserInfo();

      if (!userInfo) return;

      const response = await fetch(
        `${API_URL}/ai/sales-insights`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },

          body: JSON.stringify({}),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || data.message || "Failed to generate summary");
        return;
      }

      setInsight(data.insight);

    } catch (error) {

      console.error(error);

      alert(apiErrorMessage());

    } finally {

      setLoadingInsight(false);

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

            Loading Dashboard...

          </p>

        </div>

      </div>
    );
  }

  const statCards = stats
    ? [
        {
          label: "Products",
          value: stats.productCount,
          icon: <FaBoxOpen />,
        },
        {
          label: "Orders",
          value: stats.orderCount,
          icon: <FaClipboardList />,
        },
        {
          label: "Revenue (Paid)",
          value: `₹${stats.revenue}`,
          icon: <FaRupeeSign />,
        },
        {
          label: "Pending Orders",
          value: stats.pendingCount,
          icon: <FaHourglassHalf />,
        },
      ]
    : [];

  return (

    <div className="min-h-screen bg-background">

      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* ===================================================== */}
        {/* ==================== PAGE HEADER ==================== */}
        {/* ===================================================== */}

        <div className="flex items-center justify-between flex-wrap gap-4 mb-12">

          <div>

            <SectionLabel>

              Merchant Dashboard

            </SectionLabel>

            <h1 className="mt-4 text-5xl font-display text-foreground">

              <span className="gradient-text">

                {store?.name}

              </span>

            </h1>

          </div>

          <Link
            to="/merchant/settings"
            className="gradient-bg text-white px-5 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow-accent hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center gap-2"
          >

            <FaStore />

            Store Settings

          </Link>

        </div>

        {/* ===================================================== */}
        {/* ==================== STAT CARDS ===================== */}
        {/* ===================================================== */}

        <div className="grid md:grid-cols-4 gap-6 mb-12">

          {statCards.map((card) => (

            <Card
              key={card.label}
              className="p-6"
            >

              <div className="gradient-bg text-white w-12 h-12 flex items-center justify-center rounded-2xl mb-4 shadow-accent">

                {card.icon}

              </div>

              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">

                {card.label}

              </p>

              <h2 className="text-3xl font-display gradient-text">

                {card.value}

              </h2>

            </Card>
          ))}

        </div>

        {/* ===================================================== */}
        {/* ================== LOW STOCK ALERTS ================= */}
        {/* ===================================================== */}

        {stats?.lowStockProducts?.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl shadow-md p-8 mb-12">

            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">

              <h2 className="text-xl font-semibold text-amber-800 flex items-center gap-2">

                <FaExclamationTriangle className="text-amber-500" />

                Low Stock Alerts

              </h2>

              <Link
                to="/merchant/products"
                className="text-amber-700 font-semibold hover:underline text-sm"
              >

                Restock Products

              </Link>

            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

              {stats.lowStockProducts.map((p) => (

                <Card
                  key={p._id}
                  className="p-4 shadow-sm flex items-center justify-between gap-3"
                >

                  <div>

                    <p className="font-semibold text-foreground">

                      {p.name}

                    </p>

                    <p className="text-sm text-muted-foreground">

                      ₹{p.price}

                    </p>

                  </div>

                  <Badge className={
                    p.stock === 0
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }>

                    {p.stock === 0
                      ? "Out of Stock"
                      : `${p.stock} left`}

                  </Badge>

                </Card>
              ))}

            </div>

          </div>
        )}

        {/* ===================================================== */}
        {/* ==================== AI INSIGHTS ==================== */}
        {/* ===================================================== */}

        <Card className="p-8 mb-12">

          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">

            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">

              <FaMagic className="text-accent" />

              AI Insights

            </h2>

            <Button
              onClick={generateInsight}
              disabled={loadingInsight}
            >

              {loadingInsight
                ? "Thinking..."
                : insight
                  ? "Regenerate Summary"
                  : "Generate AI Summary"}

            </Button>

          </div>

          {insight ? (

            <p className="text-muted-foreground leading-relaxed">

              {insight}

            </p>

          ) : (

            <p className="text-muted-foreground/60">

              Generate an AI-written summary of your store's recent performance.

            </p>

          )}

        </Card>

        {/* ===================================================== */}
        {/* ==================== QUICK LINKS ==================== */}
        {/* ===================================================== */}

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">

          <Link
            to="/merchant/products"
            className="bg-card border border-border rounded-2xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
          >

            <p className="font-semibold text-lg text-foreground mb-2">

              Manage Products

            </p>

            <p className="text-muted-foreground text-sm">

              Add, edit and remove your products.

            </p>

          </Link>

          <Link
            to="/merchant/orders"
            className="bg-card border border-border rounded-2xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
          >

            <p className="font-semibold text-lg text-foreground mb-2">

              Orders

            </p>

            <p className="text-muted-foreground text-sm">

              Pack, ship and deliver customer orders.

            </p>

          </Link>

          <Link
            to="/merchant/customers"
            className="bg-card border border-border rounded-2xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
          >

            <p className="font-semibold text-lg text-foreground mb-2">

              Customers

            </p>

            <p className="text-muted-foreground text-sm">

              See who is buying from your store.

            </p>

          </Link>

          <Link
            to="/merchant/analytics"
            className="bg-card border border-border rounded-2xl shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
          >

            <p className="font-semibold text-lg text-foreground mb-2 flex items-center gap-2">

              <FaChartLine className="text-accent" />

              Analytics

            </p>

            <p className="text-muted-foreground text-sm">

              Charts for revenue, products and categories.

            </p>

          </Link>

          <Link
            to="/add-product"
            className="gradient-bg text-white rounded-2xl shadow-md p-6 hover:shadow-accent hover:-translate-y-1 transition-all duration-200"
          >

            <p className="font-semibold text-lg mb-2">

              Add Product

            </p>

            <p className="text-white/80 text-sm">

              List a new product in your store.

            </p>

          </Link>

        </div>

        {/* ===================================================== */}
        {/* =================== RECENT ORDERS =================== */}
        {/* ===================================================== */}

        <Card className="p-8">

          <h2 className="text-xl font-semibold text-foreground mb-6">

            Recent Orders

          </h2>

          {!stats || stats.recentOrders.length === 0 ? (

            <p className="text-muted-foreground">

              No orders yet.

            </p>

          ) : (

            <div className="space-y-4">

              {stats.recentOrders.map((order) => (

                <div
                  key={order._id}
                  className="flex items-center justify-between flex-wrap gap-4 border-b border-border pb-4 last:border-b-0 last:pb-0"
                >

                  <div>

                    <p className="font-semibold text-foreground">

                      {order.user?.name}

                    </p>

                    <p className="text-muted-foreground text-sm">

                      {order.user?.email}

                    </p>

                  </div>

                  <div className="text-muted-foreground text-sm">

                    {new Date(order.createdAt).toLocaleDateString()}

                  </div>

                  <div className="font-bold gradient-text">

                    ₹{order.totalPrice}

                  </div>

                  <Badge className="bg-muted text-foreground">

                    {order.status}

                  </Badge>

                </div>
              ))}

            </div>
          )}

        </Card>

      </div>

    </div>
  );
};

export default MerchantDashboard;
