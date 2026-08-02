import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { CartContext } from "../store/cartContext";
import { API_URL } from "../utils/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  // 🟢 Fetch from backend
  useEffect(() => {
    fetch(`${API_URL}/products/${id}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setProduct(null);
          setLoading(false);
          return;
        }
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!product) return <p className="p-6">Product not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link to="/" className="text-blue-500">
        ← Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-80 object-cover rounded"
        />

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="text-xl text-gray-600 mt-2">
            ₹{product.price}
          </p>

          <p className="mt-2 text-sm text-blue-600 font-medium">
             Category: {product.category}
          </p>

          <p className="mt-4 text-gray-500">
            {product.description}
          </p>

          <button
          onClick={() => {
           addToCart(product);
               setAdded(true);
                   }}
                     className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 mt-6 rounded transition"
          >
           Add to Cart
                  </button>

                {added && (
              <button
               onClick={() => navigate("/cart")}
                     className="block mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded transition"
             >
             View Cart
              </button>
            )}

          {added && (
            <p className="text-green-600 mt-2">
              Added to cart ✓
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;