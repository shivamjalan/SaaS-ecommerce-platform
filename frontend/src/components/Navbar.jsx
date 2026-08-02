import { Link } from "react-router-dom";
import { useContext } from "react";

import { motion } from "framer-motion";

import {
  FaShoppingCart,
  FaStore,
  FaUserCircle,
} from "react-icons/fa";

import { CartContext } from "../store/cartContext";
import { AuthContext } from "../store/authContext";

const Navbar = () => {

  // ================= CART =================

  const { cart = [] } =
    useContext(CartContext);

  // ================= AUTH =================

  const { userInfo, logout } =
    useContext(AuthContext);

  // ================= TOTAL ITEMS =================

  const totalItems =
    cart.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );

  return (

    <motion.nav

      initial={{
        y: -80,
        opacity: 0,
      }}

      animate={{
        y: 0,
        opacity: 1,
      }}

      transition={{
        duration: 0.5,
      }}

      className="sticky top-0 z-50 backdrop-blur-md bg-black/80 border-b border-white/10 shadow-lg"
    >

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}

        <Link
          to="/"
          className="flex items-center gap-3"
        >

          <div className="bg-gradient-to-r from-pink-500 to-rose-400 p-3 rounded-xl shadow-lg">

            <FaStore
              className="text-white"
              size={22}
            />

          </div>

          <div>

            <h1 className="text-2xl font-bold tracking-wide text-white">

              Saree SaaS

            </h1>

            <p className="text-xs text-gray-400">

              Luxury Fashion Store

            </p>

          </div>

        </Link>

        {/* NAV LINKS */}

        <div className="hidden md:flex items-center gap-8">

          {/* PRODUCTS */}

          <div className="flex items-center gap-8">

    <Link
        to="/stores"
        className="text-gray-200 hover:text-pink-400 transition duration-300 font-medium"
    >
        Stores
    </Link>

    <Link
        to="/products"
        className="text-gray-200 hover:text-pink-400 transition duration-300 font-medium"
    >
        Products
    </Link>

</div>

          {/* MY ORDERS */}

          {userInfo && (

            <Link
              to="/myorders"
              className="text-gray-200 hover:text-pink-400 transition duration-300 font-medium"
            >

              My Orders

            </Link>
          )}

          {/* ADMIN */}

          {userInfo?.user?.role ===
  "admin" && (

  <div className="flex items-center gap-6">

    <Link
      to="/add-product"
      className="text-gray-200 hover:text-pink-400 transition duration-300 font-medium"
    >

      Add Product

    </Link>

    <Link
      to="/admin/orders"
      className="text-gray-200 hover:text-pink-400 transition duration-300 font-medium"
    >

      Manage Orders

    </Link>

  </div>
)}

          {/* MERCHANT */}

          {userInfo?.user?.role ===
  "merchant" && (

  <div className="flex items-center gap-6">

    <Link
      to="/merchant/dashboard"
      className="text-gray-200 hover:text-pink-400 transition duration-300 font-medium"
    >

      Dashboard

    </Link>

    <Link
      to="/merchant/orders"
      className="text-gray-200 hover:text-pink-400 transition duration-300 font-medium"
    >

      Orders

    </Link>

    <Link
      to="/merchant/products"
      className="text-gray-200 hover:text-pink-400 transition duration-300 font-medium"
    >

      Products

    </Link>

    <Link
      to="/merchant/settings"
      className="text-gray-200 hover:text-pink-400 transition duration-300 font-medium"
    >

      Store

    </Link>

  </div>
)}

          {/* OPEN A STORE (regular users) */}

          {userInfo?.user?.role ===
  "user" && (

  <Link
    to="/create-store"
    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 px-4 py-2 rounded-xl text-sm font-medium shadow-md transition"
  >

    Open a Store

  </Link>
)}

        </div>

        {/* RIGHT SECTION */}

        <div className="flex items-center gap-5">

          {/* CART */}

          <Link
            to="/cart"
            className="relative flex items-center gap-2 text-white hover:text-pink-400 transition"
          >

            <FaShoppingCart size={22} />

            <span className="hidden sm:block font-medium">

              Cart

            </span>

            {totalItems > 0 && (

              <motion.span

                initial={{
                  scale: 0,
                }}

                animate={{
                  scale: 1,
                }}

                className="absolute -top-3 -right-3 bg-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-md"
              >

                {totalItems}

              </motion.span>
            )}

          </Link>

          {/* USER */}

          {userInfo ? (

            <div className="flex items-center gap-4">

              <div className="flex items-center gap-2 text-gray-200">

                <FaUserCircle
                  size={24}
                  className="text-pink-400"
                />

                <span className="hidden md:block font-medium">

                  {
                    userInfo?.user
                      ?.name
                  }

                </span>

              </div>

              <button
                onClick={logout}
                className="bg-gradient-to-r from-red-500 to-rose-500 hover:opacity-90 px-4 py-2 rounded-xl text-sm font-medium shadow-md transition"
              >

                Logout

              </button>

            </div>

          ) : (

            <div className="flex items-center gap-3">

              <Link
                to="/login"
                className="text-gray-200 hover:text-pink-400 transition"
              >

                Login

              </Link>

              <Link
                to="/register"
                className="bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 rounded-xl text-sm font-medium shadow-md hover:opacity-90 transition"
              >

                Register

              </Link>

            </div>

          )}

        </div>

      </div>

    </motion.nav>
  );
};

export default Navbar;