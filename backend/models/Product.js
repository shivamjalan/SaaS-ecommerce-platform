import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
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

const Product = mongoose.model(
  "Product",
  productSchema
);
console.log("PRODUCT SCHEMA:");
console.log(Product.schema.obj);
export default Product;