import { useNavigate } from "react-router-dom";

import { useContext } from "react";

import { motion } from "framer-motion";

import {
  FaEdit,
  FaEye,
  FaTrash,
} from "react-icons/fa";

import { AuthContext } from "../store/authContext";

import { API_URL } from "../utils/api";

import { LOW_STOCK_THRESHOLD } from "../utils/constants";

import { Badge } from "./ui/badge";

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
            `${API_URL}/products/${product._id}`,
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

  /* ===================================================== */
  /* ======== OWNER / SUPERADMIN ACTIONS GATE ============ */
  /* ===================================================== */

  const isOwnerOrAdmin =
    userInfo?.user?.role ===
      "superadmin" ||
    (userInfo?.user?.role ===
      "merchant" &&
      userInfo?.user?.store ===
        product.store?._id);

  /* ===================================================== */
  /* ==================== STOCK STATE ==================== */
  /* ===================================================== */

  const stock = product.stock ?? 0;

  return (

    <motion.div

      whileHover={{
        y: -8,
      }}

      transition={{
        duration: 0.3,
      }}

      className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-accent/10 hover:border-accent/40 transition-all duration-300"
    >

      {/* ===================================================== */}
      {/* ==================== IMAGE AREA ===================== */}
      {/* ===================================================== */}

      <div className="relative overflow-hidden">

        {/* IMAGE */}

        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-72 object-cover transition duration-700 group-hover:scale-110 ${
            stock === 0 ? "grayscale" : ""
          }`}
        />

        {/* CATEGORY */}

        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-4 py-2 rounded-full shadow text-sm font-semibold text-foreground">

          {product.category}

        </div>

        {/* STOCK BADGE */}

        {stock === 0 && (
          <Badge className="absolute bottom-4 left-4 bg-foreground text-background">
            Out of Stock
          </Badge>
        )}

        {/* OVERLAY */}

        <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

        {/* QUICK VIEW */}

        <button
          onClick={handleView}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 gradient-bg text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-accent-lg hover:brightness-110"
        >

          <span className="flex items-center gap-2">

            <FaEye size={14} />

            Quick View

          </span>

        </button>

      </div>

      {/* ===================================================== */}
      {/* ==================== CONTENT ======================== */}
      {/* ===================================================== */}

      <div className="p-6">

        {/* TITLE */}

        <h2 className="text-xl font-semibold tracking-[-0.01em] text-foreground mb-2">

          {product.name}

        </h2>

        {/* DESCRIPTION */}

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">

          {
            product.description
          }

        </p>

        {/* PRICE */}

        <div className="mt-5 flex items-center justify-between">

          <div>

            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">

              Starting From

            </p>

            <h3 className="mt-1 text-3xl font-bold gradient-text">

              ₹
              {product.price}

            </h3>

          </div>

          {/* VIEW BUTTON */}

          <button
            onClick={
              handleView
            }
            className="gradient-bg hover:shadow-accent text-white p-4 rounded-2xl shadow-sm transition-all duration-200 active:scale-95"
          >

            <FaEye size={18} />

          </button>

        </div>

        {/* STOCK */}

        <div className="mt-4">

          {stock === 0 ? (
            <p className="text-sm font-semibold text-red-600">

              Out of Stock

            </p>
          ) : stock <= LOW_STOCK_THRESHOLD ? (
            <p className="text-sm font-semibold text-amber-600">

              Only {stock} left

            </p>
          ) : (
            <p className="text-sm font-semibold text-emerald-600">

              In Stock

            </p>
          )}

        </div>

        {/* ===================================================== */}
        {/* ============ OWNER / ADMIN ACTIONS ================= */}
        {/* ===================================================== */}

        {isOwnerOrAdmin && (

          <div className="flex gap-3 mt-6">

            {/* EDIT */}

            <button
              onClick={
                handleEdit
              }
              className="flex-1 flex items-center justify-center gap-2 bg-muted hover:bg-muted/70 text-foreground py-3 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98]"
            >

              <FaEdit />

              Edit

            </button>

            {/* DELETE */}

            <button
              onClick={
                handleDelete
              }
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98]"
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
