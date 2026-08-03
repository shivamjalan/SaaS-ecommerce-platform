import {
  useContext,
  useState,
} from "react";
import { useEffect } from "react";
import {
  useNavigate,
} from "react-router-dom";

import {
  CartContext,
} from "../store/cartContext";
import { handleRazorpayPayment } from "../utils/razorpay";
import { API_URL } from "../utils/api";
import { roundGstTotal } from "../utils/pricing";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { SectionLabel } from "../components/ui/badge";

const PlaceOrder = () => {

  const navigate =
    useNavigate();

  const {
    cart,
    shippingAddress,
    clearCart,
  } = useContext(
    CartContext
  );

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/cart");
      return;
    }
    if (
      !shippingAddress ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      navigate("/shipping");
    }
  }, [cart, navigate, shippingAddress]);

  const [loading, setLoading] =
    useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState("COD");

  /* ===================================================== */
  /* ================= TOTAL PRICE ====================== */
  /* ===================================================== */

  const subtotal =
    cart.reduce(

      (sum, item) =>

        sum +
        item.price *
          item.quantity,

      0
    );

  // Matches the backend (subtotal + 5% GST, rounded)
  const totalPrice =
    roundGstTotal(subtotal);

  const gst = totalPrice - subtotal;

  /* ===================================================== */
  /* ================= PLACE ORDER ====================== */
  /* ===================================================== */

  const handlePlaceOrder =
    async () => {

      try {

        setLoading(true);

        const userInfo =
          JSON.parse(
            localStorage.getItem(
              "userInfo"
            )
          );

        if (!userInfo) {
          navigate("/login");
          return;
        }

        const response =
          await fetch(
            `${API_URL}/orders`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization: `Bearer ${userInfo.token}`,
              },

              body: JSON.stringify({
                orderItems: cart.map((item) => ({
                  name: item.name,
                  quantity: item.quantity,
                  image: item.image,
                  price: item.price,
                  product: item._id,
                })),

                shippingAddress,

                totalPrice,

                paymentMethod,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          alert(data.error || data.message || "Failed to place order");
          return;
        }

        if (paymentMethod === "COD") {

          alert("Order placed successfully!");

          clearCart();

          navigate("/");

        } else {

          await handleRazorpayPayment(data.order, clearCart, navigate);

        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

  return (

    <div className="min-h-screen bg-background">

      <div className="max-w-6xl mx-auto px-6 py-16">

        <SectionLabel>

          Checkout

        </SectionLabel>

        <h1 className="mt-4 text-4xl md:text-5xl font-display text-foreground">

          Place{" "}

          <span className="gradient-text">

            Order

          </span>

        </h1>

        <div className="grid md:grid-cols-2 gap-8 mt-10">

          {/* SHIPPING */}

          <div>

            <Card className="p-8">

              <h2 className="text-xl font-semibold text-foreground mb-5">

                Shipping

              </h2>

              <div className="space-y-2 text-sm text-muted-foreground">

                <p>
                  <strong className="text-foreground">
                    Address:
                  </strong>{" "}
                  {
                    shippingAddress.address
                  }
                </p>

                <p>
                  <strong className="text-foreground">
                    City:
                  </strong>{" "}
                  {
                    shippingAddress.city
                  }
                </p>

                <p>
                  <strong className="text-foreground">
                    Postal Code:
                  </strong>{" "}
                  {
                    shippingAddress
                      .postalCode
                  }
                </p>

                <p>
                  <strong className="text-foreground">
                    Country:
                  </strong>{" "}
                  {
                    shippingAddress.country
                  }
                </p>

              </div>

            </Card>

            {/* ORDER ITEMS */}

            <h2 className="text-xl font-semibold mt-10 mb-5 text-foreground">

              Order Items

            </h2>

            <div className="space-y-4">

              {cart.map((item) => (

                <Card
                  key={item._id}
                  className="p-4 flex items-center gap-4"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />

                  <div>

                    <h3 className="font-semibold text-foreground">

                      {item.name}

                    </h3>

                    <p className="text-sm text-muted-foreground">
                      Quantity:{" "}
                      {item.quantity}
                    </p>

                    <p className="font-bold gradient-text mt-1">
                      ₹
                      {item.price}
                    </p>

                  </div>

                </Card>
              ))}

            </div>

          </div>

          {/* ORDER SUMMARY */}

          <div>

            <Card className="p-8 sticky top-24">

              <h2 className="text-xl font-semibold text-foreground mb-6">

                Order Summary

              </h2>

              <div className="flex justify-between mb-3 text-muted-foreground">

                <span>
                  Items
                </span>

                <span>
                  ₹
                  {subtotal}
                </span>

              </div>

              <div className="flex justify-between mb-3 text-muted-foreground">

                <span>
                  GST (5%)
                </span>

                <span>
                  ₹
                  {gst}
                </span>

              </div>

              <div className="flex justify-between mb-6 text-muted-foreground">

                <span>
                  Shipping
                </span>

                <span>
                  Free
                </span>

              </div>

              <div className="flex justify-between text-2xl font-bold mb-6 text-foreground">

                <span>
                  Total
                </span>

                <span className="gradient-text">
                  ₹
                  {totalPrice}
                </span>

              </div>

              {/* PAYMENT METHOD */}

              <div className="mb-8">

                <h3 className="text-lg font-semibold mb-4 text-foreground">

                  Payment Method

                </h3>

                <div className="space-y-3">

                  <label className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition ${
                    paymentMethod === "COD"
                      ? "border-accent/50 bg-accent/5"
                      : "border-border hover:border-accent/30"
                  }`}>

                    <input
                      type="radio"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value)
                      }
                      className="accent-accent h-4 w-4"
                    />

                    <span className="font-medium text-foreground">

                      Cash on Delivery

                    </span>

                  </label>

                  <label className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition ${
                    paymentMethod === "Razorpay"
                      ? "border-accent/50 bg-accent/5"
                      : "border-border hover:border-accent/30"
                  }`}>

                    <input
                      type="radio"
                      value="Razorpay"
                      checked={paymentMethod === "Razorpay"}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value)
                      }
                      className="accent-accent h-4 w-4"
                    />

                    <span className="font-medium text-foreground">

                      Pay Online (Razorpay)

                    </span>

                  </label>

                </div>

              </div>

              <Button
                onClick={
                  handlePlaceOrder
                }
                disabled={
                  loading
                }
                className="w-full"
                size="lg"
              >

                {loading
                  ? "Placing Order..."
                  : "Place Order"}

              </Button>

            </Card>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PlaceOrder;
