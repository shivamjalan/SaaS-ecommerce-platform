import {
  useContext,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaMinus,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

import {
  CartContext,
} from "../store/cartContext";

import {
  roundGstTotal,
} from "../utils/pricing";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const Cart = () => {

  const navigate =
    useNavigate();

  const {
    cart,
    removeFromCart,
    updateQuantity,
  } = useContext(
    CartContext
  );

  /* ===================================================== */
  /* ==================== SUBTOTAL ====================== */
  /* ===================================================== */

  const subtotal =
    cart.reduce(

      (sum, item) =>

        sum +
        item.price *
          item.quantity,

      0
    );

  /* ===================================================== */
  /* ======================= GST ======================== */
  /* ===================================================== */

  // Matches the backend (subtotal + 5% GST, rounded)
  const total =
    roundGstTotal(subtotal);

  const gst =
    total - subtotal;

  return (

    <div className="min-h-screen bg-background">

      <div className="max-w-6xl mx-auto px-6 py-16">

        <h1 className="text-4xl md:text-5xl font-display text-foreground">

          Shopping{" "}

          <span className="gradient-text">

            Cart

          </span>

        </h1>

        {cart.length === 0 ? (

          <Card className="mt-12 p-16 text-center">

            <p className="font-display text-2xl text-foreground">

              Your cart is empty

            </p>

            <p className="mt-3 text-muted-foreground">

              Head to the stores and discover something you love.

            </p>

            <Button
              onClick={() =>
                navigate("/stores")
              }
              className="mt-8"
            >

              Explore Stores

            </Button>

          </Card>

        ) : (

          <div className="grid md:grid-cols-3 gap-8 mt-10">

            {/* LEFT SIDE */}

            <div className="md:col-span-2 space-y-4">

              {cart.map((item) => (

                <Card
                  key={item._id}
                  className="p-5 flex items-center justify-between gap-4 hover:shadow-lg transition-shadow"
                >

                  {/* PRODUCT INFO */}

                  <div className="flex items-center gap-4">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />

                    <div>

                      <h2 className="text-lg font-semibold text-foreground">

                        {item.name}

                      </h2>

                      <p className="text-muted-foreground">

                        ₹{item.price}

                      </p>

                      <p className="font-semibold text-foreground mt-1">

                        Total:
                        ₹
                        {item.price *
                          item.quantity}

                      </p>

                    </div>

                  </div>

                  {/* RIGHT SIDE */}

                  <div className="flex flex-col items-center gap-4">

                    {/* QUANTITY */}

                    <div className="flex items-center gap-3">

                      <button
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            "decrease"
                          )
                        }
                        className="h-10 w-10 flex items-center justify-center rounded-xl border border-border text-foreground hover:bg-muted hover:border-accent/30 transition"
                      >

                        <FaMinus size={12} />

                      </button>

                      <span className="font-semibold text-lg w-8 text-center">

                        {item.quantity}

                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            "increase"
                          )
                        }
                        className="h-10 w-10 flex items-center justify-center rounded-xl gradient-bg text-white shadow-sm hover:shadow-accent transition"
                      >

                        <FaPlus size={12} />

                      </button>

                    </div>

                    {/* REMOVE */}

                    <button
                      onClick={() =>
                        removeFromCart(
                          item._id
                        )
                      }
                      className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                    >

                      <FaTrash size={14} />

                      Remove

                    </button>

                  </div>

                </Card>
              ))}

            </div>

            {/* ORDER SUMMARY */}

            <Card className="p-8 h-fit sticky top-24">

              <h2 className="text-2xl font-display text-foreground mb-6">

                Order Summary

              </h2>

              <div className="space-y-3 text-sm">

                <div className="flex justify-between text-muted-foreground">

                  <span>
                    Subtotal
                  </span>

                  <span>
                    ₹
                    {subtotal}
                  </span>

                </div>

                <div className="flex justify-between text-muted-foreground">

                  <span>
                    GST (5%)
                  </span>

                  <span>
                    ₹
                    {gst}
                  </span>

                </div>

                <div className="border-t border-border pt-4 flex justify-between text-xl font-bold text-foreground">

                  <span>
                    Total
                  </span>

                  <span className="gradient-text">
                    ₹
                    {total}
                  </span>

                </div>

              </div>

              {/* CHECKOUT BUTTON */}

              <Button
                onClick={() => {

                  navigate(
                    "/shipping"
                  );

                }}
                className="w-full mt-6"
              >

                Proceed to Checkout

              </Button>

            </Card>

          </div>
        )}

      </div>

    </div>
  );
};

export default Cart;
