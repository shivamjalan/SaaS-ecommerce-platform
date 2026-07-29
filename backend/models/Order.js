import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        image: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        product: {
          type:
            mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],

    shippingAddress: {
      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      postalCode: {
        type: String,
        required: true,
      },

      country: {
        type: String,
        required: true,
      },
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    paymentMethod: {
  type: String,
  enum: ["COD", "Razorpay"],
  default: "COD",
},
razorpayOrderId: {
        type: String
    },

    razorpayPaymentId: {
        type: String
    },

    razorpaySignature: {
        type: String
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },

    paidAt: {
      type: Date,
    },

    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },

    status: {
    type: String,
    enum: [
        "Placed",
        "Packed",
        "Shipped",
        "Delivered",
        "Cancelled",
    ],
    default: "Placed",
},

    deliveredAt: {
      type: Date,
    },
    store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
},
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model(
  "Order",
  orderSchema
);
export default Order;