import { useEffect, useState, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaSearch, FaStore, FaTrash } from "react-icons/fa";
import { API_URL, apiErrorMessage, getUserInfo } from "../utils/api";
import { SectionLabel } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Skeleton from "../components/ui/skeleton";
import StoreCardSkeleton from "../components/skeletons/StoreCardSkeleton";
import usePageMeta from "../hooks/usePageMeta";
import { AuthContext } from "../store/authContext";

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const { userInfo } =
    useContext(AuthContext);

  const isAdmin =
    userInfo?.user?.role === "superadmin";

  usePageMeta(
    "Browse Stores | Vistaar",
    "Explore independent stores and shop directly from merchants on Vistaar."
  );

  const fetchStores = useCallback(async () => {

    try {

      const response = await fetch(`${API_URL}/stores`);

      const data = await response.json();

      if (!response.ok) {

        throw new Error(
          data.error || data.message || "Failed to load stores"
        );

      }

      setStores(Array.isArray(data) ? data : []);

    } catch (err) {

      console.error(err);

      setError(
        apiErrorMessage()
      );

    } finally {

      setLoading(false);

    }

  }, []);

  const handleRetry = () => {

    setLoading(true);

    setError("");

    setStores([]);

    fetchStores();

  };

  /* ===================================================== */
  /* =============== DELETE STORE (ADMIN) ================ */
  /* ===================================================== */

  const deleteStore = async (store) => {

    const confirmDelete =
      window.confirm(
        `Delete "${store.name}"? All of its products will be permanently removed.`
      );

    if (!confirmDelete) return;

    try {

      const storedUser = getUserInfo();

      if (!storedUser) return;

      const response = await fetch(
        `${API_URL}/stores/${store._id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${storedUser.token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {

        setStores((prev) =>
          prev.filter(
            (s) => s._id !== store._id
          )
        );

        alert(data.message || "Store deleted");

      } else {

        alert(data.error || data.message || "Failed to delete store");

      }

    } catch (error) {

      console.error(error);

      alert("Failed to delete store");

    }

  };

  useEffect(() => {

    (async () => {

      await fetchStores();

    })();

  }, [fetchStores]);

  if (loading) {

    return (
      <div className="min-h-screen bg-background">
        <section className="max-w-6xl mx-auto px-6 py-20">

          <div className="text-center">
            <Skeleton className="h-5 w-36 mx-auto rounded-full" />

            <Skeleton className="mt-6 h-16 w-72 max-w-full mx-auto" />

            <Skeleton className="mt-5 h-5 w-80 max-w-full mx-auto" />

          </div>

          <div className="max-w-2xl mx-auto mt-10">
            <Skeleton className="h-12 w-full rounded-xl" />

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {[...Array(6)].map((_, i) => (
              <StoreCardSkeleton key={i} />
            ))}
          </div>

        </section>
      </div>
    );

  }

  if (error) {

    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">

        <div className="gradient-bg h-16 w-16 rounded-2xl flex items-center justify-center shadow-accent mb-8">

          <FaStore className="text-white" size={28} />

        </div>

        <h1 className="text-3xl font-display text-foreground mb-4">
          Oops, something went wrong
        </h1>

        <p className="text-muted-foreground mb-8 max-w-md">
          {error}
        </p>

        <Button
          onClick={handleRetry}
          variant="primary"
        >

          Retry

        </Button>

      </div>
    );

  }

  const filteredStores =
    stores
      .filter(
        (store) =>
          store.name
            .toLowerCase()
            .includes(query.trim().toLowerCase()) ||
          (store.description || "")
            .toLowerCase()
            .includes(query.trim().toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "name-desc") return b.name.localeCompare(a.name);
        return 0;
      });

  return (
    <div className="min-h-screen bg-background">

      <section className="max-w-6xl mx-auto px-6 py-20">

        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >

          <div className="flex justify-center">

            <SectionLabel>

              Marketplace

            </SectionLabel>

          </div>

          <h1 className="mt-6 text-5xl md:text-6xl font-display text-foreground">

            Discover{" "}

            <span className="gradient-text">

              Stores

            </span>

          </h1>

          <p className="text-center text-muted-foreground mt-5 text-lg">

            Shop directly from independent merchants.

          </p>

        </motion.div>

        {/* ============ SEARCH + SORT CONTROLS ============ */}

        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mt-10">

          <div className="relative flex-1">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stores..."
              className="pl-11"
            />

          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-12 rounded-xl border border-border bg-card px-4 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >

            <option value="newest">Newest First</option>

            <option value="name">Name (A-Z)</option>

            <option value="name-desc">Name (Z-A)</option>

          </select>

        </div>

        {filteredStores.length === 0 ? (
          <div className="text-center mt-16 text-muted-foreground">

            No stores match your search.

          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">

          {filteredStores.map((store, index) => (

            <motion.div
              key={store._id}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
              whileHover={{ y: -8 }}
              className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-accent/10 hover:border-accent/40 transition-all duration-300"
            >

              <div className="relative overflow-hidden">

                <img
                  src={
                    store.logo ||
                    "https://placehold.co/800x500?text=Store"
                  }
                  className="h-56 w-full object-cover transition duration-700 group-hover:scale-110"
                  alt={store.name}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

              </div>

              <div className="p-6">

                <h2 className="text-xl font-semibold tracking-[-0.01em] text-foreground">

                  {store.name}

                </h2>

                <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">

                  {store.description || "Premium Merchant"}

                </p>

                <Link
                  to={`/store/${store.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-accent font-semibold text-sm group/link"
                >

                  Visit Store

                  <FaArrowRight className="transition-transform duration-200 group-hover/link:translate-x-1" />

                </Link>

                {isAdmin && (

                  <div className="mt-4 pt-4 border-t border-border">

                    <button
                      onClick={() => deleteStore(store)}
                      className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
                    >

                      <FaTrash className="text-xs" />

                      Delete Store

                    </button>

                  </div>

                )}

              </div>

            </motion.div>

          ))}

          </div>
        )}

      </section>

    </div>
  );
};

export default Stores;
