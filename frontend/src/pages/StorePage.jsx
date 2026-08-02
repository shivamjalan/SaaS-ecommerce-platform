import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { API_URL } from "../utils/api";
import { getTheme } from "../utils/themes";

const StorePage = () => {
  const { slug } = useParams();

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const [storeRes, productRes] = await Promise.all([
          fetch(`${API_URL}/stores/${slug}`),
          fetch(`${API_URL}/products/store/${slug}`),
        ]);

        const storeData = await storeRes.json();
        const productsData = await productRes.json();

        setStore(storeData);
        setProducts(productsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStore();
  }, [slug]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-2xl">
        Loading Store...
      </div>
    );
  }

  if (!store) {
    return (
      <div className="h-screen flex justify-center items-center text-2xl">
        Store not found.
      </div>
    );
  }

  const theme = getTheme(store.theme);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Banner */}

      <div className="relative h-80">

        <img
          src={
            store.logo ||
            "https://placehold.co/1600x600?text=Merchant+Store"
          }
          alt={store.name}
          className="w-full h-full object-cover"
        />

        <div className={`absolute inset-0 ${theme.banner} flex items-center justify-center`}>

          <div className="text-center text-white">

            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-bold"
            >
              {store.name}
            </motion.h1>

            <p className="mt-4 text-lg">

              {store.description}

            </p>

          </div>

        </div>

      </div>

      <div className="max-w-7xl mx-auto py-14 px-6">

        <h2 className="text-3xl font-bold mb-10">

          Products

        </h2>

        {products.length === 0 ? (

          <div className="text-gray-500 text-lg">

            No products available.

          </div>

        ) : (

          <div className="grid md:grid-cols-4 gap-8">

            {products.map((product) => (

              <motion.div
                key={product._id}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >

                <img
                  src={product.image}
                  className="w-full h-64 object-cover"
                  alt={product.name}
                />

                <div className="p-5">

                  <h3 className="font-semibold text-xl">

                    {product.name}

                  </h3>

                  <p className="mt-2 text-gray-600 line-clamp-2">

                    {product.description}

                  </p>

                  <div className="mt-4 flex justify-between items-center">

                    <span className="font-bold text-xl">

                      ₹{product.price}

                    </span>

                    <Link
                      to={`/product/${product._id}`}
                      className={`text-white px-4 py-2 rounded-lg ${theme.btn} transition`}
                    >
                      View
                    </Link>

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default StorePage;