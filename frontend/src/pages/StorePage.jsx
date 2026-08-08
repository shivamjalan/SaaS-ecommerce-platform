import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { API_URL, apiErrorMessage } from "../utils/api";
import ChatBot from "../components/ChatBot";
import ProductCard from "../components/Productcard";
import StorePageSkeleton from "../components/skeletons/StorePageSkeleton";
import { SectionLabel } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import usePageMeta from "../hooks/usePageMeta";

const StorePage = () => {
  const { slug } = useParams();

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  usePageMeta(
    store ? `${store.name} | Vistaar` : "Store | Vistaar",
    store?.description
      ? store.description
      : "Browse products from an independent merchant store on Vistaar."
  );

  const fetchStore = useCallback(async () => {

    try {

      const [storeRes, productRes] = await Promise.all([
        fetch(`${API_URL}/stores/${slug}`),
        fetch(`${API_URL}/products/store/${slug}`),
      ]);

      if (!storeRes.ok) {

        throw new Error(
          storeRes.status === 404
            ? "Store not found."
            : "Failed to load store."
        );

      }

      const storeData = await storeRes.json();
      const productsData = productRes.ok
        ? await productRes.json()
        : [];

      setStore(storeData);
      setProducts(Array.isArray(productsData) ? productsData : []);

    } catch (err) {

      console.error(err);

      setError(
        apiErrorMessage()
      );

    } finally {

      setLoading(false);

    }

  }, [slug]);

  const handleRetry = () => {

    setLoading(true);

    setError("");

    setStore(null);

    setProducts([]);

    fetchStore();

  };

  useEffect(() => {

    (async () => {

      await fetchStore();

    })();

  }, [fetchStore]);

  if (loading) {

    return <StorePageSkeleton />;

  }

  if (error) {

    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">

        <h1 className="text-3xl font-display text-foreground mb-4">
          Oops, something went wrong
        </h1>

        <p className="text-muted-foreground mb-8 max-w-md">
          {error}
        </p>

        <Button
          onClick={handleRetry}
        >

          Retry

        </Button>

      </div>
    );

  }

  if (!store) {

    return (
      <div className="min-h-[60vh] flex justify-center items-center text-2xl font-display text-muted-foreground">
        Store not found.
      </div>
    );

  }

  const categories = [
    "All",
    ...new Set(
      products.map((p) => p.category).filter(Boolean)
    ),
  ];

  const filteredProducts =
    products
      .filter(
        (p) =>
          category === "All" ||
          p.category === category
      )
      .filter(
        (p) =>
          p.name
            .toLowerCase()
            .includes(query.trim().toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });

  return (
    <div className="bg-background min-h-screen">

      {/* ===================================================== */}
      {/* ===================== BANNER ======================== */}
      {/* ===================================================== */}

      <div className="relative h-96 overflow-hidden">

        <img
          src={
            store.logo ||
            "https://placehold.co/1600x600?text=Merchant+Store"
          }
          alt={store.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 via-foreground/70 to-foreground" />

        <div className="relative h-full max-w-6xl mx-auto px-6 flex items-end pb-16">

          <div>

            <div className="flex items-center gap-3 mb-4">

              <span className="h-2 w-2 rounded-full bg-accent animate-pulse-dot" />

              <span className="font-mono text-xs uppercase tracking-[0.15em] text-white/70">

                Store

              </span>

            </div>

            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-display text-white"
            >
              {store.name}
            </motion.h1>

            {store.description && (
              <p className="mt-4 text-lg text-white/80 max-w-2xl">
                {store.description}
              </p>
            )}

          </div>

        </div>

      </div>

      {/* ===================================================== */}
      {/* ===================== PRODUCTS ====================== */}
      {/* ===================================================== */}

      <div className="max-w-6xl mx-auto py-16 px-6">

        <div className="flex items-center gap-4 mb-10">

          <SectionLabel>

            Collection

          </SectionLabel>

          <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">

            {filteredProducts.length} items

          </span>

        </div>

        {/* ============ SEARCH / FILTER / SORT ============ */}

        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-10">

          <div className="relative flex-1 max-w-md">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-11"
            />

          </div>

          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">

              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    category === cat
                      ? "gradient-bg text-white shadow-accent"
                      : "bg-card border border-border text-muted-foreground hover:text-accent"
                  }`}
                >

                  {cat}

                </button>
              ))}

            </div>
          )}

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-12 rounded-xl border border-border bg-card px-4 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring lg:ml-auto"
          >

            <option value="featured">Featured</option>

            <option value="price-low">Price: Low to High</option>

            <option value="price-high">Price: High to Low</option>

            <option value="name">Name (A-Z)</option>

          </select>

        </div>

        {products.length === 0 ? (

          <div className="bg-card border border-border rounded-2xl p-16 text-center shadow-md">

            <p className="font-display text-2xl text-foreground">

              No products available.

            </p>

            <p className="mt-3 text-muted-foreground">

              Check back soon — this store is restocking.

            </p>

          </div>

        ) : filteredProducts.length === 0 ? (

          <div className="bg-card border border-border rounded-2xl p-16 text-center shadow-md">

            <p className="font-display text-2xl text-foreground">

              No products match your search.

            </p>

            <p className="mt-3 text-muted-foreground">

              Try a different category or keyword.

            </p>

          </div>

        ) : (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {filteredProducts.map((product) => (

              <ProductCard
                key={product._id}
                product={product}
              />

            ))}

          </div>

        )}

      </div>

      <ChatBot
        storeSlug={slug}
        storeName={store.name}
      />

    </div>
  );
};

export default StorePage;
