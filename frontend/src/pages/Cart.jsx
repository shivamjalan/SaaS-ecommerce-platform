import {
  useContext,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  CartContext,
} from "../store/cartContext";

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
    Math.round(subtotal * 1.05);

  const gst =
    total - subtotal;

  return (

    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">

        Shopping Cart

      </h1>

      {cart.length === 0 ? (

        <div className="text-center mt-10">

          <p className="text-gray-500 text-lg">

            Your cart is empty

          </p>

        </div>

      ) : (

        <div className="grid md:grid-cols-3 gap-8">

          {/* LEFT SIDE */}

          <div className="md:col-span-2 space-y-4">

            {cart.map((item) => (

              <div
                key={item._id}
                className="border rounded-xl p-4 flex items-center justify-between shadow-sm bg-white"
              >

                {/* PRODUCT INFO */}

                <div className="flex items-center gap-4">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />

                  <div>

                    <h2 className="text-xl font-semibold">

                      {item.name}

                    </h2>

                    <p className="text-gray-500">

                      ₹{item.price}

                    </p>

                    <p className="font-medium mt-1">

                      Total:
                      ₹
                      {item.price *
                        item.quantity}

                    </p>

                  </div>

                </div>

                {/* RIGHT SIDE */}

                <div className="flex flex-col items-center gap-3">

                  {/* QUANTITY */}

                  <div className="flex items-center gap-3">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          "decrease"
                        )
                      }
                      className="bg-gray-300 px-3 py-1 rounded"
                    >

                      -

                    </button>

                    <span className="font-semibold text-lg">

                      {item.quantity}

                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item._id,
                          "increase"
                        )
                      }
                      className="bg-gray-300 px-3 py-1 rounded"
                    >

                      +

                    </button>

                  </div>

                  {/* REMOVE */}

                  <button
                    onClick={() =>
                      removeFromCart(
                        item._id
                      )
                    }
                    className="text-red-500 hover:text-red-700"
                  >

                    Remove

                  </button>

                </div>

              </div>
            ))}

          </div>

          {/* ORDER SUMMARY */}

          <div className="border rounded-xl p-6 shadow bg-white h-fit">

            <h2 className="text-2xl font-bold mb-4">

              Order Summary

            </h2>

            <div className="space-y-3">

              <div className="flex justify-between">

                <span>
                  Subtotal
                </span>

                <span>
                  ₹
                  {subtotal}
                </span>

              </div>

              <div className="flex justify-between">

                <span>
                  GST (5%)
                </span>

                <span>
                  ₹
                  {gst}
                </span>

              </div>

              <hr />

              <div className="flex justify-between text-xl font-bold">

                <span>
                  Total
                </span>

                <span>
                  ₹
                  {total}
                </span>

              </div>

            </div>

            {/* CHECKOUT BUTTON */}

            <button
              onClick={() => {

                console.log(
                  "CHECKOUT CLICKED"
                );

                navigate(
                  "/shipping"
                );

              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded mt-6 transition"
            >

              Proceed to Checkout

            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default Cart;