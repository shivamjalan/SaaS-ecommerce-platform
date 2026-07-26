import {
  useContext,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  CartContext,
} from "../store/CartContext";
import { handleRazorpayPayment } from "../utils/razorpay";
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

  const [loading, setLoading] =
    useState(false);
  const [paymentMethod, setPaymentMethod] =
  useState("COD");

  /* ===================================================== */
  /* ================= TOTAL PRICE ====================== */
  /* ===================================================== */

  const totalPrice =
    cart.reduce(

      (sum, item) =>

        sum +
        item.price *
          item.quantity,

      0
    );
  
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

        const response =
          await fetch(
            "http://localhost:5000/api/orders",
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

        console.log(data);

        if (response.ok) {

  if (paymentMethod === "COD") {

    alert("Order placed successfully!");

    clearCart();

    navigate("/");

  }

  else {

    await handleRazorpayPayment(data.order,clearCart,navigate);

  }

}

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

  return (

    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">

        Place Order

      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        {/* SHIPPING */}

        <div>

          <h2 className="text-2xl font-semibold mb-4">

            Shipping

          </h2>

          <div className="border p-4 rounded space-y-2">

            <p>
              <strong>
                Address:
              </strong>{" "}
              {
                shippingAddress.address
              }
            </p>

            <p>
              <strong>
                City:
              </strong>{" "}
              {
                shippingAddress.city
              }
            </p>

            <p>
              <strong>
                Postal Code:
              </strong>{" "}
              {
                shippingAddress
                  .postalCode
              }
            </p>

            <p>
              <strong>
                Country:
              </strong>{" "}
              {
                shippingAddress.country
              }
            </p>

          </div>

          {/* ORDER ITEMS */}

          <h2 className="text-2xl font-semibold mt-8 mb-4">

            Order Items

          </h2>

          <div className="space-y-4">

            {cart.map((item) => (

              <div
                key={item._id}
                className="flex items-center gap-4 border p-4 rounded"
              >

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />

                <div>

                  <h3 className="font-semibold">

                    {item.name}

                  </h3>

                  <p>
                    Quantity:{" "}
                    {item.quantity}
                  </p>

                  <p>
                    ₹
                    {item.price}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>

        {/* ORDER SUMMARY */}

        <div>

          <div className="border p-6 rounded shadow">

            <h2 className="text-2xl font-semibold mb-4">

              Order Summary

            </h2>

            <div className="flex justify-between mb-3">

              <span>
                Items
              </span>

              <span>
                ₹
                {totalPrice}
              </span>

            </div>

            <div className="flex justify-between mb-6">

              <span>
                Shipping
              </span>

              <span>
                Free
              </span>

            </div>

            <div className="flex justify-between text-xl font-bold mb-6">

              <span>
                Total
              </span>

              <span>
                ₹
                {totalPrice}
              </span>

            </div>
            {/* PAYMENT METHOD */}

<div className="mb-6">

  <h3 className="text-lg font-semibold mb-3">

    Payment Method

  </h3>

  <label className="flex items-center gap-2 mb-2">

    <input
      type="radio"
      value="COD"
      checked={paymentMethod === "COD"}
      onChange={(e) =>
        setPaymentMethod(e.target.value)
      }
    />

    Cash on Delivery

  </label>

  <label className="flex items-center gap-2">

    <input
      type="radio"
      value="Razorpay"
      checked={paymentMethod === "Razorpay"}
      onChange={(e) =>
        setPaymentMethod(e.target.value)
      }
    />

    Pay Online (Razorpay)

  </label>

</div>
            <button
              onClick={
                handlePlaceOrder
              }
              disabled={
                loading
              }
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded transition"
            >

              {loading
                ? "Placing Order..."
                : "Place Order"}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PlaceOrder;