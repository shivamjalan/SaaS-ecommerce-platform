import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  FaRupeeSign,
  FaShoppingBag,
  FaChartLine,
} from "react-icons/fa";

import { API_URL } from "../utils/api";

import { SectionLabel } from "../components/ui/badge";

const PIE_COLORS = [
  "#f43f5e",
  "#a855f7",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#6366f1",
];

const STATUS_COLORS = {
  Placed: "bg-orange-100 text-orange-600",
  Packed: "bg-purple-100 text-purple-600",
  Shipped: "bg-blue-100 text-blue-600",
  Delivered: "bg-green-100 text-green-600",
  Cancelled: "bg-red-100 text-red-600",
};

const MerchantAnalytics = () => {

  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  /* ===================================================== */
  /* ================= FETCH ANALYTICS =================== */
  /* ===================================================== */

  useEffect(() => {

    const fetchAnalytics = async () => {

      try {

        const userInfo = JSON.parse(
          localStorage.getItem("userInfo")
        );

        const response = await fetch(
          `${API_URL}/merchant/analytics`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        const data = await response.json();

        setAnalytics(data);

      } catch (error) {

        console.log(error);

        alert("Failed to load analytics");

      } finally {

        setLoading(false);

      }

    };

    fetchAnalytics();

  }, []);

  /* ===================================================== */
  /* ================ FILL MISSING DAYS ================== */
  /* ===================================================== */

  const buildDailySales = () => {

    const map = new Map();

    analytics.dailySales.forEach((day) => {
      map.set(day.date, day.revenue);
    });

    const days = [];

    for (let i = 29; i >= 0; i--) {

      const date = new Date();

      date.setDate(date.getDate() - i);

      const key = date.toISOString().slice(0, 10);

      days.push({
        date: key.slice(5),
        revenue: map.get(key) || 0,
      });

    }

    return days;

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

            Loading Analytics...

          </p>

        </div>

      </div>
    );
  }

  const dailySales = buildDailySales();

  const totalOrders = analytics.orderStatusBreakdown.reduce(
    (sum, item) => sum + item.count,
    0
  );

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

            Store

            <span className="gradient-text">

              {" "}Analytics

            </span>

          </h1>

        </div>

        {/* ===================================================== */}
        {/* ==================== SUMMARY CARDS ================== */}
        {/* ===================================================== */}

        <div className="grid md:grid-cols-3 gap-6 mb-12">

          <div className="bg-card border border-border rounded-2xl shadow-md p-6">

            <div className="flex items-center gap-3 mb-4">

              <div className="gradient-bg h-10 w-10 rounded-2xl flex items-center justify-center shadow-accent">

                <FaRupeeSign className="text-white" />

              </div>

              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">

                Lifetime Revenue

              </p>

            </div>

            <h2 className="text-4xl font-display gradient-text flex items-center">

              <FaRupeeSign className="mr-1" />

              {analytics.totalRevenue}

            </h2>

          </div>

          <div className="bg-card border border-border rounded-2xl shadow-md p-6">

            <div className="flex items-center gap-3 mb-4">

              <div className="gradient-bg h-10 w-10 rounded-2xl flex items-center justify-center shadow-accent">

                <FaShoppingBag className="text-white" />

              </div>

              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">

                Total Orders

              </p>

            </div>

            <h2 className="text-4xl font-display gradient-text">

              {totalOrders}

            </h2>

          </div>

          <div className="bg-card border border-border rounded-2xl shadow-md p-6">

            <div className="flex items-center gap-3 mb-4">

              <div className="gradient-bg h-10 w-10 rounded-2xl flex items-center justify-center shadow-accent">

                <FaChartLine className="text-white" />

              </div>

              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">

                Last 30 Days Revenue

              </p>

            </div>

            <h2 className="text-4xl font-display gradient-text flex items-center">

              <FaRupeeSign className="mr-1" />

              {dailySales.reduce(
                (sum, day) => sum + day.revenue,
                0
              )}

            </h2>

          </div>

        </div>

        {/* ===================================================== */}
        {/* ================= REVENUE OVER TIME ================= */}
        {/* ===================================================== */}

        <div className="bg-card border border-border rounded-2xl shadow-md p-8 mb-12">

          <div className="mb-6">

            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">

              Sales Trend

            </p>

            <h2 className="text-2xl font-display text-foreground">

              Revenue —{" "}

              <span className="gradient-text">

                Last 30 Days

              </span>

            </h2>

          </div>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <AreaChart data={dailySales}>

              <defs>

                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >

                  <stop
                    offset="5%"
                    stopColor="#f43f5e"
                    stopOpacity={0.4}
                  />

                  <stop
                    offset="95%"
                    stopColor="#f43f5e"
                    stopOpacity={0}
                  />

                </linearGradient>

              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0e9e1"
              />

              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                tick={{ fontSize: 12 }}
              />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#f43f5e"
                fill="url(#revenueGradient)"
                strokeWidth={2}
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

        {/* ===================================================== */}
        {/* ============ TOP PRODUCTS + CATEGORY PIE ============ */}
        {/* ===================================================== */}

        <div className="grid lg:grid-cols-2 gap-8 mb-12">

          <div className="bg-card border border-border rounded-2xl shadow-md p-8">

            <h2 className="text-2xl font-display text-foreground mb-6">

              Top{" "}

              <span className="gradient-text">

                Products

              </span>

            </h2>

            {analytics.topProducts.length === 0 ? (

              <p className="text-muted-foreground">

                No products sold yet.

              </p>

            ) : (

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <BarChart
                  data={analytics.topProducts}
                  layout="vertical"
                  margin={{ left: 30 }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0e9e1"
                  />

                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={130}
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="revenue"
                    fill="#a855f7"
                    radius={[0, 8, 8, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>
            )}

          </div>

          <div className="bg-card border border-border rounded-2xl shadow-md p-8">

            <h2 className="text-2xl font-display text-foreground mb-6">

              Revenue by{" "}

              <span className="gradient-text">

                Category

              </span>

            </h2>

            {analytics.categoryRevenue.length === 0 ? (

              <p className="text-muted-foreground">

                No category data yet.

              </p>

            ) : (

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <PieChart>

                  <Pie
                    data={analytics.categoryRevenue}
                    dataKey="revenue"
                    nameKey="category"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                  >

                    {analytics.categoryRevenue.map(
                      (entry, index) => (

                        <Cell
                          key={entry.category}
                          fill={
                            PIE_COLORS[
                              index % PIE_COLORS.length
                            ]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>
            )}

          </div>

        </div>

        {/* ===================================================== */}
        {/* =================== ORDER STATUS ==================== */}
        {/* ===================================================== */}

        <div className="bg-card border border-border rounded-2xl shadow-md p-8">

          <h2 className="text-2xl font-display text-foreground mb-6">

            Order Status{" "}

            <span className="gradient-text">

              Breakdown

            </span>

          </h2>

          <div className="flex flex-wrap gap-4">

            {analytics.orderStatusBreakdown.map((item) => (

              <div
                key={item.status}
                className={`px-6 py-4 rounded-2xl font-bold ${
                  STATUS_COLORS[item.status] ||
                  "bg-gray-100 text-gray-600"
                }`}
              >

                {item.status}: {item.count}

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  );
};

export default MerchantAnalytics;
