import { useEffect, useState } from "react";

import {
  FaRupeeSign,
  FaShoppingBag,
  FaUser,
} from "react-icons/fa";

import { API_URL } from "../utils/api";

const MerchantCustomers = () => {

  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);

  /* ===================================================== */
  /* ================= FETCH CUSTOMERS =================== */
  /* ===================================================== */

  useEffect(() => {

    const fetchCustomers = async () => {

      try {

        const userInfo = JSON.parse(
          localStorage.getItem("userInfo")
        );

        const response = await fetch(
          `${API_URL}/merchant/customers`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        const data = await response.json();

        setCustomers(data);

      } catch (error) {

        console.log(error);

        alert("Failed to load customers");

      } finally {

        setLoading(false);

      }

    };

    fetchCustomers();

  }, []);

  /* ===================================================== */
  /* ==================== LOADING ======================== */
  /* ===================================================== */

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">

        <h1 className="text-3xl font-bold">

          Loading Customers...

        </h1>

      </div>
    );
  }

  const totalRevenue = customers.reduce(
    (sum, customer) => sum + customer.totalSpent,
    0
  );

  return (

    <div className="min-h-screen bg-gradient-to-b from-[#faf7f2] via-white to-[#f8f5f0]">

      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* HEADER */}

        <div className="mb-12">

          <p className="uppercase tracking-[5px] text-rose-500 font-semibold mb-3">

            Merchant

          </p>

          <h1 className="text-5xl font-bold text-gray-900 mb-4">

            Customers

          </h1>

          <p className="text-gray-500">

            {customers.length} unique customers · ₹{totalRevenue} total lifetime revenue

          </p>

        </div>

        {customers.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-xl p-16 text-center">

            <p className="text-2xl font-bold text-gray-700 mb-2">

              No customers yet

            </p>

            <p className="text-gray-500">

              Customers who order from your store will appear here.

            </p>

          </div>

        ) : (

          <div className="bg-white rounded-3xl shadow-xl divide-y divide-gray-100">

            {customers.map((customer) => (

              <div
                key={customer._id}
                className="p-6 flex items-center gap-4"
              >

                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center shrink-0">

                  <FaUser />

                </div>

                <div className="flex-1 min-w-0">

                  <p className="font-bold truncate">

                    {customer.name || "Unknown"}

                  </p>

                  <p className="text-gray-500 text-sm truncate">

                    {customer.email}

                  </p>

                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm">

                  <FaShoppingBag />

                  {customer.orderCount} orders

                </div>

                <div className="flex items-center gap-1 font-bold text-rose-500 w-32 justify-end">

                  <FaRupeeSign />

                  {customer.totalSpent}

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default MerchantCustomers;
