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

import { FaRupeeSign } from "react-icons/fa";

import { API_URL } from "../utils/api";

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

      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">

        <h1 className="text-3xl font-bold">

          Loading Analytics...

        </h1>

      </div>
    );
  }

  const dailySales = buildDailySales();

  const totalOrders = analytics.orderStatusBreakdown.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (

    <div className="min-h-screen bg-gradient-to-b from-[#faf7f2] via-white to-[#f8f5f0]">

      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* HEADER */}

        <div className="mb-12">

          <p className="uppercase tracking-[5px] text-rose-500 font-semibold mb-3">

            Merchant

          </p>

          <h1 className="text-5xl font-bold text-gray-900">

            Analytics

          </h1>

        </div>

        {/* SUMMARY CARDS */}

        <div className="grid md:grid-cols-3 gap-6 mb-12">

          <div className="bg-white rounded-3xl shadow-lg p-6">

            <p className="text-gray-500 text-sm mb-1">

              Lifetime Revenue

            </p>

            <h2 className="text-3xl font-bold text-gray-900 flex items-center">

              <FaRupeeSign className="text-rose-500 mr-1" />

              {analytics.totalRevenue}

            </h2>

          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">

            <p className="text-gray-500 text-sm mb-1">

              Total Orders

            </p>

            <h2 className="text-3xl font-bold text-gray-900">

              {totalOrders}

            </h2>

          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">

            <p className="text-gray-500 text-sm mb-1">

              Last 30 Days Revenue

            </p>

            <h2 className="text-3xl font-bold text-gray-900 flex items-center">

              <FaRupeeSign className="text-rose-500 mr-1" />

              {dailySales.reduce(
                (sum, day) => sum + day.revenue,
                0
              )}

            </h2>

          </div>

        </div>

        {/* REVENUE OVER TIME */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">

          <h2 className="text-2xl font-bold mb-6">

            Revenue — Last 30 Days

          </h2>

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

        {/* TOP PRODUCTS + CATEGORY PIE */}

        <div className="grid lg:grid-cols-2 gap-12 mb-12">

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-2xl font-bold mb-6">

              Top Products

            </h2>

            {analytics.topProducts.length === 0 ? (

              <p className="text-gray-500">

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

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-2xl font-bold mb-6">

              Revenue by Category

            </h2>

            {analytics.categoryRevenue.length === 0 ? (

              <p className="text-gray-500">

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

        {/* ORDER STATUS */}

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <h2 className="text-2xl font-bold mb-6">

            Order Status Breakdown

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
