import { API_URL } from "./api";

/* ===================================================== */
/* ================= LOAD RAZORPAY CHECKOUT ============ */
/* ===================================================== */

const loadRazorpayCheckout = () => {

  return new Promise((resolve, reject) => {

    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve();

    script.onerror = () =>
      reject(
        new Error(
          "checkout.js failed to load"
        )
      );

    document.body.appendChild(script);

  });

};

/* ===================================================== */
/* ================= HANDLE RAZORPAY PAYMENT =========== */
/* ===================================================== */

export const handleRazorpayPayment = async (order, clearCart, navigate) => {

  try {

    const userInfo = JSON.parse(
      localStorage.getItem("userInfo")
    );

    if (!userInfo || !userInfo.token) {
      alert("Please login to continue");
      return;
    }

    if (!order || !order.totalPrice) {
      alert("Order total is invalid. Please try again.");
      return;
    }

    // Create Razorpay Order
    const response = await fetch(
      `${API_URL}/payment/create-order`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },

        body: JSON.stringify({
          amount: order.totalPrice,
          orderId: order._id,
        }),
      }
    );

    const razorpayOrder = await response.json();
    if (!response.ok) {
      alert(
        razorpayOrder.message ||
        "Unable to create Razorpay order"
      );
      return;
    }

    // Make sure the checkout script is available
    try {
      await loadRazorpayCheckout();
    } catch {
      alert(
        "Could not load Razorpay checkout. Check your connection or disable any ad blocker, then retry."
      );
      return;
    }

    const options = {
  key: import.meta.env.VITE_RAZORPAY_KEY,

  amount: razorpayOrder.amount,

  currency: razorpayOrder.currency,

  name: "Saree SaaS",

  description: "Order Payment",

  order_id: razorpayOrder.id,

  handler: async function (response) {

  try {

    const userInfo = JSON.parse(
      localStorage.getItem("userInfo")
    );

    const verifyResponse = await fetch(
      `${API_URL}/payment/verify`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },

        body: JSON.stringify({

          razorpay_order_id:
            response.razorpay_order_id,

          razorpay_payment_id:
            response.razorpay_payment_id,

          razorpay_signature:
            response.razorpay_signature,

          orderId: order._id,

        }),

      }
    );

    const result =
      await verifyResponse.json();

    if (result.success) {

  alert("Payment Successful!");

  if (clearCart) {
    clearCart();
  }

  if (navigate) {
    navigate("/myorders");
  }

} else {

      alert("Payment Verification Failed");

    }

  } catch (error) {

    console.log(error);

    alert("Payment Verification Failed");

  }

},
modal: {
        ondismiss: function () {
            alert("Payment cancelled. You can retry it anytime from My Orders.");
        },
    },

  theme: {
    color: "#22c55e",
  },
};

const rzp = new window.Razorpay(options);
rzp.on("payment.failed", function (response) {

  alert(response.error.description);

  console.log(response.error);

});
rzp.open();

  } catch (error) {

    console.log(error);

  }

};
