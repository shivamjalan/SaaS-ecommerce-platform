import mongoose from "mongoose";

import Product from "../models/Product.js";
import Store from "../models/storeModel.js";

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
      await Product.findById(req.params.id).populate("store", "name slug logo");

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
      store,
    } = req.body;

    // Admin picks the store; merchants use their own store
    const storeId =
      req.store
        ? req.store._id
        : store;

    if (!storeId) {

      return res.status(400).json({
        error: "Store is required",
      });

    }

    const existingStore =
      await Store.findById(storeId);

    if (!existingStore) {

      return res.status(400).json({
        error: "Store not found",
      });

    }

    const newProduct =
      new Product({
        name,
        price,
        image,
        category,
        description,
        store: storeId,
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
            ...(req.store && {
              store: req.store._id,
            }),
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
            runValidators:true,
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
        ...(req.store && {
          store:req.store._id,
        }),
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

export const getMerchantProducts = async (req, res) => {
    try {

        const products = await Product.find({
            store: req.store._id,
        }).sort({
          createdAt:-1
        });

        res.json(products);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message,
        });

    }
};
/* ===================================================== */
/* ============== PRODUCT RECOMMENDATIONS ============== */
/* ===================================================== */

export const getProductRecommendations = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

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

    let recommendations =
      await Product.find({
        store: product.store,
        category: product.category,
        _id: { $ne: product._id },
      })
        .limit(4)
        .lean();

    if (
      recommendations.length < 4
    ) {

      const existingIds =
        recommendations.map(
          (item) => item._id
        );

      const fallback =
        await Product.find({
          store: product.store,
          _id: {
            $ne: product._id,
            $nin: existingIds,
          },
        })
          .limit(
            4 - recommendations.length
          )
          .lean();

      recommendations = [
        ...recommendations,
        ...fallback,
      ];

    }

    res.json(recommendations);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Server error",
    });

  }

};

/* ===================================================== */
/* ============== GET STORE PRODUCTS =================== */
/* ===================================================== */

export const getStoreProducts = (async (req, res) => {
    const store = await Store.findOne({
        slug: req.params.slug,
    });

    if (!store) {
        res.status(404);
        throw new Error("Store not found");
    }

    const products = await Product.find({
        store: store._id,
    }).populate("store", "name slug logo");

    res.json(products);
});