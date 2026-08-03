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

import { Button } from "./ui/button";

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

  // ================= ROLE =================

  const role = userInfo?.user?.role;

  const isMerchant = role === "merchant";

  const isAdmin = role === "superadmin";

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

      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
    >

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}

        <Link
          to="/"
          className="flex items-center gap-3 group"
        >

          <div className="gradient-bg p-3 rounded-xl shadow-accent group-hover:shadow-accent-lg transition-shadow">

            <FaStore
              className="text-white"
              size={22}
            />

          </div>

          <div>

            <h1 className="font-display text-2xl text-foreground leading-tight">

              Saree SaaS

            </h1>

            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">

              {isMerchant
                ? "Merchant Workspace"
                : isAdmin
                ? "Superadmin Console"
                : "Luxury Fashion Store"}

            </p>

          </div>

        </Link>

        {/* NAV LINKS */}

        <div className="hidden md:flex items-center gap-8">

          {/* STORES (hidden for merchants) */}

          {!isMerchant && (

            <Link
              to="/stores"
              className="text-muted-foreground hover:text-accent transition-colors font-medium"
            >
              Stores
            </Link>
          )}

          {/* MY ORDERS (normal users) */}

          {userInfo?.user?.role ===
"user" && (

<Link
  to="/myorders"
  className="text-muted-foreground hover:text-accent transition-colors font-medium"
>

  My Orders

</Link>
)}

          {/* MERCHANT */}

          {userInfo?.user?.role ===
"merchant" && (

<div className="flex items-center gap-6">

  <Link
    to="/merchant/dashboard"
    className="text-muted-foreground hover:text-accent transition-colors font-medium"
  >

    Dashboard

  </Link>

  <Link
    to="/merchant/orders"
    className="text-muted-foreground hover:text-accent transition-colors font-medium"
  >

    Orders

  </Link>

  <Link
    to="/merchant/analytics"
    className="text-muted-foreground hover:text-accent transition-colors font-medium"
  >

    Analytics

  </Link>

  <Link
    to="/merchant/products"
    className="text-muted-foreground hover:text-accent transition-colors font-medium"
  >

    Products

  </Link>

  <Link
    to="/merchant/settings"
    className="text-muted-foreground hover:text-accent transition-colors font-medium"
  >

    Store

  </Link>

</div>
)}

          {/* SUPERADMIN */}

          {userInfo?.user?.role ===
"superadmin" && (

<div className="flex items-center gap-6">

  <Link
    to="/add-product"
    className="text-muted-foreground hover:text-accent transition-colors font-medium"
  >

    Add Product

  </Link>

  <Link
    to="/admin/orders"
    className="text-muted-foreground hover:text-accent transition-colors font-medium"
  >

    Manage Orders

  </Link>

</div>
)}

          {/* OPEN A STORE (regular users) */}

          {userInfo?.user?.role ===
"user" && (

<Link
  to="/create-store"
  className="gradient-bg text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow-accent hover:-translate-y-0.5 transition-all duration-200"
>

  Open a Store

</Link>
)}

        </div>

        {/* RIGHT SECTION */}

        <div className="flex items-center gap-5">

          {/* CART (hidden for merchants) */}

          {!isMerchant && (

          <Link
            to="/cart"
            className="relative flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
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

                className="absolute -top-3 -right-3 gradient-bg text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-accent"
              >

                {totalItems}

              </motion.span>
            )}

          </Link>
          )}

          {/* USER */}

          {userInfo ? (

            <div className="flex items-center gap-4">

              <div className="flex items-center gap-2 text-foreground">

                <FaUserCircle
                  size={24}
                  className="text-accent"
                />

                <span className="hidden md:block font-medium">

                  {
                    userInfo?.user
                      ?.name
                  }

                </span>

                {isMerchant && (
                  <span className="hidden md:inline-flex font-mono text-[11px] uppercase tracking-wide bg-accent/10 text-accent border border-accent/30 px-2 py-0.5 rounded-full">
                    Merchant
                  </span>
                )}

                {isAdmin && (
                  <span className="hidden md:inline-flex font-mono text-[11px] uppercase tracking-wide bg-accent/10 text-accent border border-accent/30 px-2 py-0.5 rounded-full">
                    Superadmin
                  </span>
                )}

              </div>

              <Button
                onClick={logout}
                variant="outline"
                size="sm"
              >

                Logout

              </Button>

            </div>

          ) : (

            <div className="flex items-center gap-3">

              <Link
                to="/login"
                className="text-muted-foreground hover:text-accent transition-colors"
              >

                Login

              </Link>

              <Link
                to="/register"
                className="gradient-bg text-white px-5 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow-accent hover:-translate-y-0.5 transition-all duration-200"
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
