import { useNavigate } from "react-router-dom";

import { useContext } from "react";

import { motion } from "framer-motion";

import {
  FaHeart,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import { AuthContext } from "../store/AuthContext";

const ProductCard = ({
  product,
}) => {

  const navigate =
    useNavigate();

  const { userInfo } =
    useContext(AuthContext);

  /* ===================================================== */
  /* ==================== DELETE ========================= */
  /* ===================================================== */

  const handleDelete =
    async () => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this product?"
        );

      if (!confirmDelete)
        return;

      try {

        const storedUser =
          JSON.parse(
            localStorage.getItem(
              "userInfo"
            )
          );

        const response =
          await fetch(
            `http://localhost:5000/api/products/${product._id}`,
            {
              method:
                "DELETE",

              headers: {
                Authorization: `Bearer ${storedUser.token}`,
              },
            }
          );

        const data =
          await response.json();

        console.log(data);

        if (
          response.ok
        ) {

          alert(
            "Deleted successfully"
          );

          window.location.reload();

        } else {

          alert(
            data.error
          );
        }

      } catch (error) {

        console.log(
          error
        );

      }
    };

  /* ===================================================== */
  /* ====================== VIEW ========================= */
  /* ===================================================== */

  const handleView =
    () => {

      navigate(
        `/product/${product._id}`
      );
    };

  /* ===================================================== */
  /* ====================== EDIT ========================= */
  /* ===================================================== */

  const handleEdit =
    () => {

      navigate(
        `/edit-product/${product._id}`
      );
    };

  return (

    <motion.div

      whileHover={{
        y: -10,
      }}

      transition={{
        duration: 0.3,
      }}

      className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-500 border border-gray-100"
    >

      {/* ===================================================== */}
      {/* ==================== IMAGE AREA ===================== */}
      {/* ===================================================== */}

      <div className="relative overflow-hidden">

        {/* IMAGE */}

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-80 object-cover transition duration-700 group-hover:scale-110"
        />

        {/* CATEGORY */}

        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow text-sm font-semibold text-gray-700">

          {product.category}

        </div>

        {/* WISHLIST */}

        <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full shadow hover:bg-rose-500 hover:text-white transition">

          <FaHeart />

        </button>

        {/* OVERLAY */}

        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-500" />

      </div>

      {/* ===================================================== */}
      {/* ==================== CONTENT ======================== */}
      {/* ===================================================== */}

      <div className="p-6">

        {/* TITLE */}

        <h2 className="text-2xl font-bold text-gray-900 mb-2">

          {product.name}

        </h2>

        {/* DESCRIPTION */}

        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">

          {
            product.description
          }

        </p>

        {/* PRICE */}

        <div className="mt-5 flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-400">

              Starting From

            </p>

            <h3 className="text-3xl font-bold text-rose-500">

              ₹
              {product.price}

            </h3>

          </div>

          {/* VIEW BUTTON */}

          <button
            onClick={
              handleView
            }
            className="bg-black hover:bg-gray-900 text-white p-4 rounded-2xl shadow-lg transition"
          >

            <FaEye size={18} />

          </button>

        </div>

        {/* ===================================================== */}
        {/* ================= ADMIN ACTIONS ==================== */}
        {/* ===================================================== */}

        {userInfo?.user
          ?.role ===
          "admin" && (

          <div className="flex gap-3 mt-6">

            {/* EDIT */}

            <button
              onClick={
                handleEdit
              }
              className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-2xl font-semibold transition"
            >

              <FaEdit />

              Edit

            </button>

            {/* DELETE */}

            <button
              onClick={
                handleDelete
              }
              className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-semibold transition"
            >

              <FaTrash />

              Delete

            </button>

          </div>
        )}

      </div>

    </motion.div>
  );
};

export default ProductCard;