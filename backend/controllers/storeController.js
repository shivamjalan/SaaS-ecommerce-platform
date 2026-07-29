import Store from "../models/storeModel.js";
import User from "../models/User.js";

export const createStore = async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        message: "Name and slug are required",
      });
    }

    // Check slug
    const existingStore = await Store.findOne({ slug });

    if (existingStore) {
      return res.status(400).json({
        message: "Store slug already exists",
      });
    }

    // Check if user already owns a store
    const alreadyOwnsStore = await Store.findOne({
      owner: req.user._id,
    });

    if (alreadyOwnsStore) {
      return res.status(400).json({
        message: "You already own a store",
      });
    }

    // Create store
    const store = await Store.create({
      name,
      slug,
      description,
      owner: req.user._id,
    });

    // Promote user to merchant
    await User.findByIdAndUpdate(req.user._id, {
      role: "merchant",
      store: store._id,
    });

    res.status(201).json(store);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===================================================== */
/* ================= GET ALL STORES ==================== */
/* ===================================================== */

export const getAllStores = async (req, res) => {
  try {
    const stores = await Store.find({})
      .select("name slug logo description theme")
      .sort({ createdAt: -1 });

    res.json(stores);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===================================================== */
/* ================= GET STORE BY SLUG ================= */
/* ===================================================== */

export const getStoreBySlug = async (req, res) => {
  try {
    const store = await Store.findOne({
      slug: req.params.slug,
    }).select(
      "name slug logo description theme subscription"
    );

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    res.json(store);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};