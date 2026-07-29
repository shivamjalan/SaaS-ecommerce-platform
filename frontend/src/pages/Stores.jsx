import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const { data } = await axios.get("/api/stores");
        console.log(data);
console.log(Array.isArray(data));
        setStores(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl font-semibold">
        Loading Stores...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf7f2] via-white to-[#f8f5f0]">

      <section className="max-w-7xl mx-auto px-6 py-16">

        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
        >

          <h1 className="text-5xl font-bold text-center text-gray-900">

            Discover Stores

          </h1>

          <p className="text-center text-gray-500 mt-4 text-lg">

            Shop directly from independent merchants.

          </p>

        </motion.div>

        <div className="grid md:grid-cols-3 gap-10 mt-14">

          {stores.map((store, index) => (

            <motion.div
              key={store._id}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl duration-300"
            >

              <img
                src={
                  store.logo ||
                  "https://placehold.co/800x500?text=Store"
                }
                className="h-60 w-full object-cover"
                alt={store.name}
              />

              <div className="p-6">

                <h2 className="text-2xl font-bold">

                  {store.name}

                </h2>

                <p className="mt-3 text-gray-600 line-clamp-3">

                  {store.description || "Premium Merchant"}

                </p>

                <Link
                  to={`/store/${store.slug}`}
                  className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-xl hover:bg-rose-600 duration-300"
                >

                  Visit Store →

                </Link>

              </div>

            </motion.div>

          ))}

        </div>

      </section>

    </div>
  );
};

export default Stores;