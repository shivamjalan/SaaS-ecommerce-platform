import { useEffect, useState } from "react";

import {
  FaRupeeSign,
  FaShoppingBag,
  FaUser,
} from "react-icons/fa";

import { API_URL } from "../utils/api";

import { SectionLabel } from "../components/ui/badge";

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

      <div className="min-h-screen flex items-center justify-center bg-background">

        <div className="flex flex-col items-center gap-4">

          <div className="h-12 w-12 rounded-full border-2 border-border border-t-accent animate-spin" />

          <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">

            Loading Customers...

          </p>

        </div>

      </div>
    );
  }

  const totalRevenue = customers.reduce(
    (sum, customer) => sum + customer.totalSpent,
    0
  );

  return (

    <div className="min-h-screen bg-background">

      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* ===================================================== */}
        {/* ==================== PAGE HEADER ==================== */}
        {/* ===================================================== */}

        <div className="mb-12">

          <SectionLabel>

            Merchant

          </SectionLabel>

          <h1 className="mt-4 text-5xl font-display text-foreground mb-4">

            Your{" "}

            <span className="gradient-text">

              Customers

            </span>

          </h1>

          <p className="text-muted-foreground text-lg">

            {customers.length} unique customers ·{" "}

            <span className="font-semibold gradient-text">

              ₹{totalRevenue}

            </span>{" "}

            total lifetime revenue

          </p>

        </div>

        {customers.length === 0 ? (

          <div className="bg-card border border-border rounded-[2rem] shadow-lg p-16 text-center">

            <div className="gradient-bg h-20 w-20 rounded-2xl mx-auto flex items-center justify-center shadow-accent mb-8">

              <FaUser className="text-white text-4xl" />

            </div>

            <h2 className="text-3xl font-display text-foreground mb-4">

              No Customers Yet

            </h2>

            <p className="text-muted-foreground text-lg">

              Customers who order from your store will appear here.

            </p>

          </div>

        ) : (

          <div className="bg-card border border-border rounded-[2rem] shadow-lg divide-y divide-border">

            {customers.map((customer) => (

              <div
                key={customer._id}
                className="p-6 flex items-center gap-4"
              >

                <div className="w-12 h-12 rounded-full gradient-bg text-white flex items-center justify-center shrink-0 shadow-accent">

                  <FaUser />

                </div>

                <div className="flex-1 min-w-0">

                  <p className="font-bold text-foreground truncate">

                    {customer.name || "Unknown"}

                  </p>

                  <p className="text-muted-foreground text-sm truncate">

                    {customer.email}

                  </p>

                </div>

                <div className="flex items-center gap-2 text-muted-foreground text-sm">

                  <FaShoppingBag />

                  <span className="font-semibold text-foreground">

                    {customer.orderCount}

                  </span>{" "}

                  orders

                </div>

                <div className="flex items-center gap-1 font-display gradient-text w-32 justify-end text-xl">

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
