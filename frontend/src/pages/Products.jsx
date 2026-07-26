import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import ProductCard from "../components/Productcard";

const Products = () => {

  const [products, setProducts] =
    useState([]);

  // SEARCH

  const [search, setSearch] =
    useState("");

  // CATEGORY

  const [category, setCategory] =
    useState("All");

  /* ===================================================== */
  /* ================= FETCH PRODUCTS ==================== */
  /* ===================================================== */

  useEffect(() => {

    const fetchProducts =
      async () => {

        try {

          const response =
            await fetch(
              "http://localhost:5000/api/products"
            );

          const data =
            await response.json();

          setProducts(data);

        } catch (error) {

          console.log(error);

        }
      };

    fetchProducts();

  }, []);

  /* ===================================================== */
  /* ================= FILTER PRODUCTS =================== */
  /* ===================================================== */

  const filteredProducts =
    products.filter((product) => {

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        category === "All"
          ? true
          : product.category ===
            category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  return (

    <div className="min-h-screen bg-gradient-to-b from-[#faf7f2] via-white to-[#f8f5f0]">

      {/* SEARCH + FILTER */}

      <section
        className="max-w-7xl mx-auto px-6 pt-16"
      >

        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">

          <div>

            <p className="text-rose-500 font-semibold uppercase tracking-[4px]">

              Luxury Collection

            </p>

            <h1 className="text-5xl font-bold text-gray-900 mt-2">

              Explore Sarees

            </h1>

          </div>

          <p className="text-gray-500 text-lg">

            {filteredProducts.length}
            {" "}Products Available

          </p>

        </div>

        <div className="bg-white shadow-lg rounded-3xl p-6 flex flex-col md:flex-row gap-4 items-center justify-between">

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search luxury sarees..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full md:w-1/2 border border-gray-200 px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-rose-400"
          />

          {/* CATEGORY */}

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="border border-gray-200 px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-rose-400"
          >

            <option value="All">

              All Categories

            </option>

            <option value="Silk">

              Silk

            </option>

            <option value="Cotton">

              Cotton

            </option>

            <option value="Designer">

              Designer

            </option>

          </select>

        </div>

      </section>

      {/* PRODUCTS */}

      <section
        className="max-w-7xl mx-auto px-6 py-20"
      >

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

          {filteredProducts.map(
            (product, index) => (

              <motion.div

                key={product._id}

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
              >

                <ProductCard
                  product={product}
                />

              </motion.div>
            )
          )}

        </div>

      </section>

    </div>
  );
};

export default Products;