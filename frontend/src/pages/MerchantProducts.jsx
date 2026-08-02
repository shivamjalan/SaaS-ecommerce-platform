import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

import { API_URL } from "../utils/api";

const MerchantProducts = () => {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [deleting, setDeleting] = useState(null);

  /* ===================================================== */
  /* ================= FETCH PRODUCTS ==================== */
  /* ===================================================== */

  const fetchProducts = async () => {

    try {

      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      const response = await fetch(
        `${API_URL}/merchant/products`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      const data = await response.json();

      setProducts(data);

    } catch (error) {

      console.log(error);

      alert("Failed to load products");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    const loadProducts = async () => {

      await fetchProducts();

    };

    loadProducts();

  }, []);

  /* ===================================================== */
  /* ================== DELETE PRODUCT =================== */
  /* ===================================================== */

  const handleDelete = async (product) => {

    if (!window.confirm(
      `Delete "${product.name}"? This cannot be undone.`
    )) {
      return;
    }

    try {

      setDeleting(product._id);

      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      const response = await fetch(
        `${API_URL}/merchant/products/${product._id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete product");
        return;
      }

      setProducts((prev) =>
        prev.filter((p) => p._id !== product._id)
      );

      alert("Product deleted");

    } catch (error) {

      console.log(error);

      alert("Failed to delete product");

    } finally {

      setDeleting(null);

    }

  };

  /* ===================================================== */
  /* ==================== LOADING ======================== */
  /* ===================================================== */

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">

        <h1 className="text-3xl font-bold">

          Loading Products...

        </h1>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-b from-[#faf7f2] via-white to-[#f8f5f0]">

      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* HEADER */}

        <div className="flex items-center justify-between flex-wrap gap-4 mb-12">

          <div>

            <p className="uppercase tracking-[5px] text-rose-500 font-semibold mb-3">

              Merchant

            </p>

            <h1 className="text-5xl font-bold text-gray-900">

              Products

            </h1>

          </div>

          <Link
            to="/add-product"
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition inline-flex items-center gap-2"
          >

            <FaPlus />

            Add Product

          </Link>

        </div>

        {products.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-xl p-16 text-center">

            <p className="text-2xl font-bold text-gray-700 mb-2">

              No products yet

            </p>

            <p className="text-gray-500 mb-6">

              Add your first product to start selling.

            </p>

            <Link
              to="/add-product"
              className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >

              Add Product

            </Link>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {products.map((product) => (

              <div
                key={product._id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden"
              >

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />

                <div className="p-6">

                  <p className="text-sm text-gray-400 uppercase mb-1">

                    {product.category}

                  </p>

                  <p className="text-lg font-bold mb-2">

                    {product.name}

                  </p>

                  <p className="font-semibold text-rose-500 mb-4">

                    ₹{product.price}

                  </p>

                  <div className="flex items-center gap-3">

                    <Link
                      to={`/edit-product/${product._id}`}
                      className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded font-semibold hover:bg-gray-50 transition"
                    >

                      <FaEdit className="text-gray-500" />

                      Edit

                    </Link>

                    <button
                      onClick={() => handleDelete(product)}
                      disabled={deleting === product._id}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded font-semibold hover:bg-red-600 transition disabled:opacity-50"
                    >

                      <FaTrash />

                      {deleting === product._id
                        ? "Deleting..."
                        : "Delete"}

                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default MerchantProducts;
