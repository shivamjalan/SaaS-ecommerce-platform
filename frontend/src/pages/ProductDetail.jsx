import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaCartPlus, FaExpand } from "react-icons/fa";
import { CartContext } from "../store/cartContext";
import { API_URL, apiErrorMessage } from "../utils/api";
import { LOW_STOCK_THRESHOLD } from "../utils/constants";
import usePageMeta from "../hooks/usePageMeta";
import ProductCard from "../components/Productcard";
import ImageLightbox from "../components/ImageLightbox";
import ProductDetailSkeleton from "../components/skeletons/ProductDetailSkeleton";
import { Button } from "../components/ui/button";
import { SectionLabel } from "../components/ui/badge";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [error, setError] = useState("");

  usePageMeta(
    product
      ? `${product.name} | Vistaar`
      : "Product | Vistaar",
    product
      ? `${product.description}`
      : "Shop from independent stores on Vistaar."
  );

  // Fetch from backend
  const fetchProduct = useCallback(() => {

    fetch(`${API_URL}/products/${id}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setProduct(null);
          return;
        }
        setProduct(data);
      })
      .catch((err) => {
        console.error(err);
        setError(
          apiErrorMessage()
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleRetry = () => {

    setLoading(true);

    setError("");

    setProduct(null);

    fetchProduct();

  };

  useEffect(() => {
    (async () => {
      await fetchProduct();
    })();
  }, [fetchProduct]);

  // Fetch "You may also like" recommendations
  useEffect(() => {
    fetch(`${API_URL}/products/${id}/recommendations`)
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        setRecommendations(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        setRecommendations([]);
      });
  }, [id]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-display text-foreground mb-4">
          Oops, something went wrong
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md">{error}</p>
        <Button onClick={handleRetry}>Retry</Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center text-2xl font-display text-muted-foreground">
        Product not found
      </div>
    );
  }

  const stock = product.stock ?? 0;

  const gallery = [
    product.image,
    ...(product.images || []),
  ].filter(
    (img, i, arr) => img && arr.indexOf(img) === i
  );

  const activeImage = gallery[activeIndex] || product.image;

  return (
    <div className="min-h-screen bg-background">

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* BACK LINK */}

        <Link
          to={
            product.store?.slug
              ? `/store/${product.store.slug}`
              : "/stores"
          }
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors font-medium"
        >

          <FaArrowLeft />

          Back to Store

        </Link>

        <div className="grid md:grid-cols-2 gap-12 mt-8">

          {/* ============== IMAGE ============== */}

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >

            <div className="gradient-border rounded-[2rem] p-[2px] shadow-lg relative group">

              <button
                onClick={() => setLightboxOpen(true)}
                aria-label="View image full screen"
                className="block w-full cursor-zoom-in"
              >

                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-[28rem] object-cover rounded-[calc(2rem-2px)] bg-card"
                />

              </button>

              <button
                onClick={() => setLightboxOpen(true)}
                aria-label="View image full screen"
                className="absolute bottom-4 right-4 h-11 w-11 rounded-full bg-black/60 hover:bg-accent text-white flex items-center justify-center backdrop-blur transition"
              >

                <FaExpand size={16} />

              </button>

            </div>

            {gallery.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`rounded-xl overflow-hidden shrink-0 transition ${
                      i === activeIndex
                        ? "ring-2 ring-accent ring-offset-2 ring-offset-background"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="w-20 h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

          </motion.div>

          {/* ============== DETAILS ============== */}

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >

            <SectionLabel>

              {product.category}

            </SectionLabel>

            <h1 className="mt-6 text-4xl font-display text-foreground">

              {product.name}

            </h1>

            <p className="text-3xl font-bold gradient-text mt-4">

              ₹{product.price}

            </p>

            <p className="mt-6 text-muted-foreground leading-relaxed">

              {product.description}

            </p>

            {/* STOCK */}

            <div className="mt-6">

              {stock === 0 ? (
                <p className="text-red-600 font-semibold">
                  Out of Stock
                </p>
              ) : stock <= LOW_STOCK_THRESHOLD ? (
                <p className="text-amber-600 font-semibold">
                  Only {stock} left in stock
                </p>
              ) : (
                <p className="text-emerald-600 font-semibold">
                  In Stock
                </p>
              )}

            </div>

            {stock === 0 ? (
              <div className="mt-8 bg-red-50 border border-red-200 text-red-700 text-center font-semibold px-6 py-4 rounded-xl">
                This product is currently unavailable
              </div>
            ) : (
              <Button
                onClick={() => {
                  addToCart(product);
                  setAdded(true);
                }}
                size="lg"
                className="mt-8"
              >

                <FaCartPlus />

                Add to Cart

              </Button>
            )}

            {added && (
              <div className="mt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Button
                  onClick={() => navigate("/cart")}
                  variant="outline"
                  size="lg"
                >

                  View Cart

                </Button>

                <p className="text-emerald-600 font-medium">
                  Added to cart ✓
                </p>
              </div>
            )}

          </motion.div>

        </div>

        {/* ============== RECOMMENDATIONS ============== */}

        {recommendations.length > 0 && (
          <div className="mt-24">
            <SectionLabel>

              Discover More

            </SectionLabel>

            <h2 className="mt-6 text-3xl font-display text-foreground">

              You may also{" "}

              <span className="gradient-text">

                like

              </span>

            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {recommendations.map((rec) => (
                <ProductCard key={rec._id} product={rec} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ============== FULL-SCREEN LIGHTBOX ============== */}

      <AnimatePresence>

        {lightboxOpen && (
          <ImageLightbox
            images={gallery}
            index={activeIndex}
            open={lightboxOpen}
            onClose={() => setLightboxOpen(false)}
            onIndexChange={setActiveIndex}
          />
        )}

      </AnimatePresence>

    </div>
  );
};

export default ProductDetail;
