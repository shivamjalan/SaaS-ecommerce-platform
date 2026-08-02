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
} from "react-icons/fa";

import { API_URL } from "../utils/api";

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

        const userInfo = JSON.parse(
          localStorage.getItem("userInfo")
        );

        const headers = {
          Authorization: `Bearer ${userInfo.token}`,
        };

        const [storeRes, statsRes] = await Promise.all([

          fetch(`${API_URL}/stores/me`, { headers }),

          fetch(`${API_URL}/merchant/dashboard`, { headers }),

        ]);

        const storeData = await storeRes.json();
        const statsData = await statsRes.json();

        setStore(storeData);
        setStats(statsData);

      } catch (error) {

        console.log(error);

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

      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

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
        alert(data.error || "Failed to generate summary");
        return;
      }

      setInsight(data.insight);

    } catch (error) {

      console.log(error);

      alert("Failed to generate summary");

    } finally {

      setLoadingInsight(false);

    }

  };

  /* ===================================================== */
  /* ==================== LOADING ======================== */
  /* ===================================================== */

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">

        <h1 className="text-3xl font-bold">

          Loading Dashboard...

        </h1>

      </div>
    );
  }

  const statCards = stats
    ? [
        {
          label: "Products",
          value: stats.productCount,
          icon: <FaBoxOpen />,
          color: "bg-blue-500",
        },
        {
          label: "Orders",
          value: stats.orderCount,
          icon: <FaClipboardList />,
          color: "bg-purple-500",
        },
        {
          label: "Revenue (Paid)",
          value: `₹${stats.revenue}`,
          icon: <FaRupeeSign />,
          color: "bg-green-500",
        },
        {
          label: "Pending Orders",
          value: stats.pendingCount,
          icon: <FaHourglassHalf />,
          color: "bg-orange-500",
        },
      ]
    : [];

  return (

    <div className="min-h-screen bg-gradient-to-b from-[#faf7f2] via-white to-[#f8f5f0]">

      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* HEADER */}

        <div className="flex items-center justify-between flex-wrap gap-4 mb-12">

          <div>

            <p className="uppercase tracking-[5px] text-rose-500 font-semibold mb-3">

              Merchant Dashboard

            </p>

            <h1 className="text-5xl font-bold text-gray-900">

              {store?.name}

            </h1>

          </div>

          <Link
            to="/merchant/settings"
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition inline-flex items-center gap-2"
          >

            <FaStore />

            Store Settings

          </Link>

        </div>

        {/* STAT CARDS */}

        <div className="grid md:grid-cols-4 gap-6 mb-12">

          {statCards.map((card) => (

            <div
              key={card.label}
              className="bg-white rounded-3xl shadow-lg p-6"
            >

              <div className={`${card.color} text-white w-12 h-12 flex items-center justify-center rounded-2xl mb-4`}>

                {card.icon}

              </div>

              <p className="text-gray-500 text-sm mb-1">

                {card.label}

              </p>

              <h2 className="text-3xl font-bold text-gray-900">

                {card.value}

              </h2>

            </div>
          ))}

        </div>

        {/* AI INSIGHTS */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">

          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">

            <h2 className="text-2xl font-bold flex items-center gap-2">

              <FaMagic className="text-rose-500" />

              AI Insights

            </h2>

            <button
              onClick={generateInsight}
              disabled={loadingInsight}
              className={`px-6 py-3 rounded-xl font-semibold text-white transition ${
                loadingInsight
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-90"
              }`}
            >

              {loadingInsight
                ? "Thinking..."
                : insight
                  ? "Regenerate Summary"
                  : "Generate AI Summary"}

            </button>

          </div>

          {insight ? (

            <p className="text-gray-600 leading-relaxed">

              {insight}

            </p>

          ) : (

            <p className="text-gray-400">

              Generate an AI-written summary of your store's recent performance.

            </p>

          )}

        </div>

        {/* QUICK LINKS */}

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">

          <Link
            to="/merchant/products"
            className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition"
          >

            <p className="font-bold text-lg mb-2">

              Manage Products

            </p>

            <p className="text-gray-500 text-sm">

              Add, edit and remove your products.

            </p>

          </Link>

          <Link
            to="/merchant/orders"
            className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition"
          >

            <p className="font-bold text-lg mb-2">

              Orders

            </p>

            <p className="text-gray-500 text-sm">

              Pack, ship and deliver customer orders.

            </p>

          </Link>

          <Link
            to="/merchant/customers"
            className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition"
          >

            <p className="font-bold text-lg mb-2">

              Customers

            </p>

            <p className="text-gray-500 text-sm">

              See who is buying from your store.

            </p>

          </Link>

          <Link
            to="/merchant/analytics"
            className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition"
          >

            <p className="font-bold text-lg mb-2 flex items-center gap-2">

              <FaChartLine className="text-rose-500" />

              Analytics

            </p>

            <p className="text-gray-500 text-sm">

              Charts for revenue, products and categories.

            </p>

          </Link>

          <Link
            to="/add-product"
            className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-3xl shadow-lg p-6 hover:opacity-90 transition"
          >

            <p className="font-bold text-lg mb-2">

              Add Product

            </p>

            <p className="text-white/80 text-sm">

              List a new product in your store.

            </p>

          </Link>

        </div>

        {/* RECENT ORDERS */}

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <h2 className="text-2xl font-bold mb-6">

            Recent Orders

          </h2>

          {!stats || stats.recentOrders.length === 0 ? (

            <p className="text-gray-500">

              No orders yet.

            </p>

          ) : (

            <div className="space-y-4">

              {stats.recentOrders.map((order) => (

                <div
                  key={order._id}
                  className="flex items-center justify-between flex-wrap gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                >

                  <div>

                    <p className="font-semibold">

                      {order.user?.name}

                    </p>

                    <p className="text-gray-500 text-sm">

                      {order.user?.email}

                    </p>

                  </div>

                  <div className="text-gray-500 text-sm">

                    {new Date(order.createdAt).toLocaleDateString()}

                  </div>

                  <div className="font-bold text-rose-500">

                    ₹{order.totalPrice}

                  </div>

                  <div className="px-4 py-1 rounded-full bg-gray-100 font-semibold text-sm">

                    {order.status}

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default MerchantDashboard;
