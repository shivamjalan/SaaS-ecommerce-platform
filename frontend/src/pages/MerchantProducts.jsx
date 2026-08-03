import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

import { Button } from "../components/ui/button";

import { Card } from "../components/ui/card";

import { Input } from "../components/ui/input";

import { SectionLabel, Badge } from "../components/ui/badge";

import { API_URL } from "../utils/api";

import { LOW_STOCK_THRESHOLD } from "../utils/constants";

const MerchantProducts = () => {

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [deleting, setDeleting] = useState(null);

  const [editingStock, setEditingStock] =
    useState(null);

  const [stockInput, setStockInput] =
    useState("");

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
  /* ================ UPDATE PRODUCT STOCK =============== */
  /* ===================================================== */

  const handleStockSave = async (product) => {

    const value = Number(stockInput);

    if (isNaN(value) || value < 0) {

      alert("Enter a valid stock quantity");

      return;

    }

    try {

      const userInfo = JSON.parse(
        localStorage.getItem("userInfo")
      );

      const response = await fetch(
        `${API_URL}/merchant/products/${product._id}/stock`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },

          body: JSON.stringify({ stock: value }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to update stock");
        return;
      }

      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id
            ? { ...p, stock: data.product.stock }
            : p
        )
      );

      setEditingStock(null);

      setStockInput("");

      alert("Stock updated");

    } catch (error) {

      console.log(error);

      alert("Failed to update stock");

    }

  };

  /* ===================================================== */
  /* ==================== LOADING ======================== */
  /* ===================================================== */

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-background">

        <div className="flex flex-col items-center gap-4">

          <div className="h-12 w-12 rounded-full border-2 border-border border-t-accent animate-spin" />

          <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">

            Loading Products...

          </p>

        </div>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-background">

      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* ===================================================== */}
        {/* ==================== PAGE HEADER ==================== */}
        {/* ===================================================== */}

        <div className="flex items-center justify-between flex-wrap gap-4 mb-12">

          <div>

            <SectionLabel>

              Merchant

            </SectionLabel>

            <h1 className="mt-4 text-5xl font-display text-foreground">

              <span className="gradient-text">

                Products

              </span>

            </h1>

          </div>

          <Link
            to="/add-product"
            className="gradient-bg text-white px-5 py-2 rounded-xl text-sm font-medium shadow-sm hover:shadow-accent hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center gap-2"
          >

            <FaPlus />

            Add Product

          </Link>

        </div>

        {/* ===================================================== */}
        {/* ==================== EMPTY STATE ==================== */}
        {/* ===================================================== */}

        {products.length === 0 ? (

          <Card className="p-16 text-center">

            <p className="text-3xl font-display text-foreground mb-2">

              No products yet

            </p>

            <p className="text-muted-foreground mb-6">

              Add your first product to start selling.

            </p>

            <Link
              to="/add-product"
              className="gradient-bg text-white px-6 py-3 rounded-xl font-semibold shadow-sm hover:shadow-accent hover:-translate-y-0.5 transition-all duration-200 inline-block"
            >

              Add Product

            </Link>

          </Card>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {products.map((product) => (

              <Card
                key={product._id}
                className="overflow-hidden"
              >

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />

                <div className="p-6">

                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">

                    {product.category}

                  </p>

                  <p className="text-lg font-semibold text-foreground mb-2">

                    {product.name}

                  </p>

                  <p className="font-semibold gradient-text mb-2">

                    ₹{product.price}

                  </p>

                  <div className="flex items-center gap-3 mb-4 flex-wrap">

                    {(product.stock ?? 0) === 0 ? (
                      <Badge className="bg-red-100 text-red-700">
                        Out of Stock
                      </Badge>
                    ) : (product.stock ?? 0) <= LOW_STOCK_THRESHOLD ? (
                      <Badge className="bg-amber-100 text-amber-700">
                        Low Stock: {(product.stock ?? 0)}
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-700">
                        Stock: {(product.stock ?? 0)}
                      </Badge>
                    )}

                    {editingStock === product._id ? (
                      <div className="flex items-center gap-2">

                        <Input
                          type="number"
                          value={stockInput}
                          onChange={(e) => setStockInput(e.target.value)}
                          min="0"
                          autoFocus
                          className="w-24 h-10"
                        />

                        <Button
                          size="sm"
                          onClick={() => handleStockSave(product)}
                        >
                          Save
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingStock(null);
                            setStockInput("");
                          }}
                        >
                          Cancel
                        </Button>

                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingStock(product._id);
                          setStockInput(product.stock ?? 0);
                        }}
                      >
                        Edit Stock
                      </Button>
                    )}

                  </div>

                  <div className="flex items-center gap-3">

                    <Link
                      to={`/edit-product/${product._id}`}
                      className="flex-1 flex items-center justify-center gap-2 border border-border py-2 rounded-xl font-semibold text-foreground hover:bg-muted transition"
                    >

                      <FaEdit className="text-muted-foreground" />

                      Edit

                    </Link>

                    <Button
                      variant="danger"
                      className="flex-1"
                      onClick={() => handleDelete(product)}
                      disabled={deleting === product._id}
                    >

                      <FaTrash />

                      {deleting === product._id
                        ? "Deleting..."
                        : "Delete"}

                    </Button>

                  </div>

                </div>

              </Card>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default MerchantProducts;
