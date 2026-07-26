import mongoose from "mongoose";

import Product from "../models/Product.js";

/* ===================================================== */
/* ================= GET ALL PRODUCTS ================== */
/* ===================================================== */

export const getProducts = async (
  req,
  res
) => {

  try {

    const products =
      await Product.find({
        store:req.store._id
      });

    res.json(products);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error",
    });

  }
};

/* ===================================================== */
/* ================= GET SINGLE PRODUCT ================ */
/* ===================================================== */

export const getProductById = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    // VALIDATE OBJECT ID
    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {

      return res.status(400).json({
        error: "Invalid product ID",
      });

    }

    const product =
      await Product.findById(id);

    if (!product) {

      return res.status(404).json({
        error: "Product not found",
      });

    }

    res.json(product);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error",
    });

  }
};

/* ===================================================== */
/* ================= CREATE PRODUCT ==================== */
/* ===================================================== */

export const createProduct = async (
  req,
  res
) => {

  try {

    const {
      name,
      price,
      image,
      category,
      description,
    } = req.body;

    const newProduct =
      new Product({
        name,
        price,
        image,
        category,
        description,
        store: req.store._id,
      });

    await newProduct.save();

    res.status(201).json({
      message:
        "Product added successfully",
      product: newProduct,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error",
    });

  }
};

/* ===================================================== */
/* ================= UPDATE PRODUCT ==================== */
/* ===================================================== */

export const updateProduct = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const {
      name,
      price,
      image,
      category,
      description,
    } = req.body;

    // VALIDATE OBJECT ID
    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {

      return res.status(400).json({
        error: "Invalid product ID",
      });

    }

    const updatedProduct =
    await Product.findOneAndUpdate(

        {
            _id: id,
            store: req.store._id,
        },

        {
            name,
            price,
            image,
            category,
            description,
        },

        {
            new: true,
        }

    );

    if (!updatedProduct) {

      return res.status(404).json({
        error: "Product not found",
      });

    }

    res.json({
      message:
        "Product updated successfully",
      product: updatedProduct,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error",
    });

  }
};

/* ===================================================== */
/* ================= DELETE PRODUCT ==================== */
/* ===================================================== */

export const deleteProduct = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    // VALIDATE OBJECT ID
    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {

      return res.status(400).json({
        error: "Invalid product ID",
      });

    }

    const deletedProduct =
      await Product.findOneAndDelete({
        _id:id,
          store:req.store._id,
      }
        
      );

    if (!deletedProduct) {

      return res.status(404).json({
        error: "Product not found",
      });

    }

    res.json({
      message:
        "Product deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error",
    });

  }
};

/* ===================================================== */
/* ================= SEED PRODUCTS ===================== */
/* ===================================================== */

export const seedProducts = async (
  req,
  res
) => {

  try {

    // DELETE OLD PRODUCTS
    await Product.deleteMany();

    const sampleProducts = [

      {
        name: "Silk Saree",
        price: 2500,
        image:
          "https://picsum.photos/300/200?random=1",
        category: "Silk",
        description:
          "Premium silk saree perfect for weddings and festivals.",
      },

      {
        name: "Cotton Saree",
        price: 1200,
        image:
          "https://picsum.photos/300/200?random=2",
        category: "Cotton",
        description:
          "Lightweight cotton saree for daily comfort.",
      },

      {
        name: "Designer Saree",
        price: 3500,
        image:
          "https://picsum.photos/300/200?random=3",
        category: "Designer",
        description:
          "Luxury designer saree with elegant patterns.",
      },

    ];

    await Product.insertMany(
      sampleProducts
    );

    res.json({
      message:
        "Database seeded successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Server error",
    });

  }
};