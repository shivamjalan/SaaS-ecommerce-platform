import { Link } from "react-router-dom";
import { useContext, useState } from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  FaShoppingCart,
  FaStore,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { CartContext } from "../store/cartContext";
import { AuthContext } from "../store/authContext";

import { Button } from "./ui/button";

const Navbar = () => {

  // ================= MOBILE MENU =================

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () =>
    setMenuOpen(false);

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

  // ================= SHARED LINK CLASSES =================

  const linkClass =
    "text-muted-foreground hover:text-accent transition-colors font-medium whitespace-nowrap";

  const mobileLinkClass =
    "block px-3 py-2.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-muted transition-colors font-medium";

  const ctaClass =
    "gradient-bg text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow-accent hover:-translate-y-0.5 transition-all duration-200 w-full lg:w-auto text-center whitespace-nowrap";

  return (

    <motion.nav

      initial={false}

      animate={{
        y: 0,
        opacity: 1,
      }}

      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md"
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">

        {/* LOGO */}

        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3 group flex-shrink-0 min-w-0 whitespace-nowrap"
        >

          <div className="gradient-bg p-3 rounded-xl shadow-accent group-hover:shadow-accent-lg transition-shadow">

            <FaStore
              className="text-white"
              size={22}
            />

          </div>

          <div className="min-w-0">

            <h1 className="font-display text-xl sm:text-2xl text-foreground leading-tight truncate">

              Vistaar

            </h1>

            <p className="hidden md:block font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">

              {isMerchant
                ? "Merchant Workspace"
                : isAdmin
                ? "Superadmin Console"
                : "Multi-Vendor Marketplace"}

            </p>

          </div>

        </Link>

        {/* NAV LINKS — DESKTOP (lg+) */}

        <div className="hidden lg:flex items-center gap-8">

          {/* STORES (hidden for merchants) */}

          {!isMerchant && (

            <Link
              to="/stores"
              className={linkClass}
            >
              Stores
            </Link>
          )}

          {/* MY ORDERS (normal users) */}

          {role ===
            "user" && (

              <Link
                to="/myorders"
                className={linkClass}
              >
                My Orders
              </Link>
            )}

          {/* MERCHANT */}

          {role ===
            "merchant" && (
              <>
                <Link
                  to="/merchant/dashboard"
                  className={linkClass}
                >
                  Dashboard
                </Link>

                <Link
                  to="/merchant/orders"
                  className={linkClass}
                >
                  Orders
                </Link>

                <Link
                  to="/merchant/analytics"
                  className={linkClass}
                >
                  Analytics
                </Link>

                <Link
                  to="/merchant/products"
                  className={linkClass}
                >
                  Products
                </Link>

                <Link
                  to="/merchant/settings"
                  className={linkClass}
                >
                  Store
                </Link>
              </>
            )}

          {/* SUPERADMIN */}

          {role ===
            "superadmin" && (
              <>
                <Link
                  to="/add-product"
                  className={linkClass}
                >
                  Add Product
                </Link>

                <Link
                  to="/admin/orders"
                  className={linkClass}
                >
                  Manage Orders
                </Link>
              </>
            )}

          {/* OPEN A STORE (regular users) */}

          {role ===
            "user" && (

              <Link
                to="/create-store"
                className={ctaClass}
              >
                Open a Store
              </Link>
            )}

        </div>

        {/* RIGHT SECTION */}

        <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">

          {/* CART (hidden for merchants) */}

          {!isMerchant && (

            <Link
              to="/cart"
              onClick={closeMenu}
              className="relative flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
            >

              <FaShoppingCart size={22} />

              <span className="hidden sm:block font-medium whitespace-nowrap">

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

          {/* USER — DESKTOP (lg+) */}

          {userInfo ? (

            <div className="hidden lg:flex items-center gap-4">

              <div className="flex items-center gap-2 text-foreground">

                <FaUserCircle
                  size={24}
                  className="text-accent"
                />

                <span className="block font-medium whitespace-nowrap">

                  {
                    userInfo?.user
                      ?.name
                  }

                </span>

                {isMerchant && (
                  <span className="hidden xl:inline-flex font-mono text-[11px] uppercase tracking-wide bg-accent/10 text-accent border border-accent/30 px-2 py-0.5 rounded-full whitespace-nowrap">
                    Merchant
                  </span>
                )}

                {isAdmin && (
                  <span className="hidden xl:inline-flex font-mono text-[11px] uppercase tracking-wide bg-accent/10 text-accent border border-accent/30 px-2 py-0.5 rounded-full whitespace-nowrap">
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

            <div className="hidden lg:flex items-center gap-3">

              <Link
                to="/login"
                className="text-muted-foreground hover:text-accent transition-colors whitespace-nowrap"
              >

                Login

              </Link>

              <Link
                to="/register"
                className="gradient-bg text-white px-5 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow-accent hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
              >

                Register

              </Link>

            </div>

          )}

          {/* MOBILE — LOGIN LINK + HAMBURGER */}

          <div className="lg:hidden flex items-center gap-2">

            {!userInfo && (

              <Link
                to="/login"
                onClick={closeMenu}
                className="text-muted-foreground hover:text-accent transition-colors text-sm font-medium whitespace-nowrap"
              >

                Login

              </Link>
            )}

            <button
              onClick={() =>
                setMenuOpen((open) => !open)
              }
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              className="p-2 rounded-xl text-foreground hover:text-accent hover:bg-muted transition-colors"
            >

              {menuOpen ? (
                <FaTimes size={22} />
              ) : (
                <FaBars size={22} />
              )}

            </button>

          </div>

        </div>

      </div>

      {/* MOBILE MENU — below lg */}

      <AnimatePresence>

        {menuOpen && (

          <motion.div

            initial={{
              opacity: 0,
              height: 0,
            }}

            animate={{
              opacity: 1,
              height: "auto",
            }}

            exit={{
              opacity: 0,
              height: 0,
            }}

            transition={{
              duration: 0.25,
            }}

            className="lg:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur-md"
          >

            <div className="px-4 py-4 space-y-1">

              {/* STORES (hidden for merchants) */}

              {!isMerchant && (

                <Link
                  to="/stores"
                  onClick={closeMenu}
                  className={mobileLinkClass}
                >
                  Stores
                </Link>
              )}

              {/* MY ORDERS (normal users) */}

              {role ===
                "user" && (

                  <Link
                    to="/myorders"
                    onClick={closeMenu}
                    className={mobileLinkClass}
                  >
                    My Orders
                  </Link>
                )}

              {/* MERCHANT */}

              {role ===
                "merchant" && (
                  <>
                    <Link
                      to="/merchant/dashboard"
                      onClick={closeMenu}
                      className={mobileLinkClass}
                    >
                      Dashboard
                    </Link>

                    <Link
                      to="/merchant/orders"
                      onClick={closeMenu}
                      className={mobileLinkClass}
                    >
                      Orders
                    </Link>

                    <Link
                      to="/merchant/analytics"
                      onClick={closeMenu}
                      className={mobileLinkClass}
                    >
                      Analytics
                    </Link>

                    <Link
                      to="/merchant/products"
                      onClick={closeMenu}
                      className={mobileLinkClass}
                    >
                      Products
                    </Link>

                    <Link
                      to="/merchant/settings"
                      onClick={closeMenu}
                      className={mobileLinkClass}
                    >
                      Store
                    </Link>
                  </>
                )}

              {/* SUPERADMIN */}

              {role ===
                "superadmin" && (
                  <>
                    <Link
                      to="/add-product"
                      onClick={closeMenu}
                      className={mobileLinkClass}
                    >
                      Add Product
                    </Link>

                    <Link
                      to="/admin/orders"
                      onClick={closeMenu}
                      className={mobileLinkClass}
                    >
                      Manage Orders
                    </Link>
                  </>
                )}

              {/* OPEN A STORE (regular users) */}

              {role ===
                "user" && (

                  <Link
                    to="/create-store"
                    onClick={closeMenu}
                    className={ctaClass}
                  >
                    Open a Store
                  </Link>
                )}

              {/* ACCOUNT FOOTER */}

              {userInfo ? (

                <div className="pt-3 mt-3 border-t border-border space-y-3">

                  <div className="flex items-center gap-2 px-3 text-foreground">

                    <FaUserCircle
                      size={20}
                      className="text-accent flex-shrink-0"
                    />

                    <span className="font-medium truncate">
                      {userInfo?.user?.name}
                    </span>

                    {isMerchant && (
                      <span className="font-mono text-[11px] uppercase tracking-wide bg-accent/10 text-accent border border-accent/30 px-2 py-0.5 rounded-full ml-auto flex-shrink-0">
                        Merchant
                      </span>
                    )}

                    {isAdmin && (
                      <span className="font-mono text-[11px] uppercase tracking-wide bg-accent/10 text-accent border border-accent/30 px-2 py-0.5 rounded-full ml-auto flex-shrink-0">
                        Superadmin
                      </span>
                    )}

                  </div>

                  <Button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >

                    Logout

                  </Button>

                </div>

              ) : (

                <div className="pt-3 mt-3 border-t border-border flex gap-3">

                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex-1 text-center border border-border rounded-xl px-4 py-2 text-sm font-medium text-foreground hover:border-accent/30 hover:shadow-sm transition-all duration-200"
                  >

                    Login

                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="flex-1 text-center gradient-bg text-white rounded-xl px-4 py-2 text-sm font-medium shadow-sm hover:shadow-accent transition-all duration-200"
                  >

                    Register

                  </Link>

                </div>

              )}

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </motion.nav>
  );
};

export default Navbar;
