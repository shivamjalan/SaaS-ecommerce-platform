export const handleRazorpayPayment = async (order,clearCart,navigate) => {

  try {

    const userInfo = JSON.parse(
      localStorage.getItem("userInfo")
    );

    // Create Razorpay Order
    const response = await fetch(
      "http://localhost:5000/api/payment/create-order",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },

        body: JSON.stringify({
          amount: order.totalPrice,
          orderId:order._id,
        }),
      }
    );

    const razorpayOrder = await response.json();
    if (!response.ok) {
  alert("Unable to create Razorpay order");
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
      "http://localhost:5000/api/payment/verify",
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