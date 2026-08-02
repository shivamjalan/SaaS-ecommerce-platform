import Store from "../models/storeModel.js";

export const merchantStore = async (req, res, next) => {
  try {
    // User must already be authenticated
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Superadmin manages all stores
    if (req.user.role === "superadmin") {
      return next();
    }

    // Must be a merchant
    if (req.user.role !== "merchant") {
      return res.status(403).json({
        message: "Only merchants can access this resource",
      });
    }

    // User must have a linked store
    if (!req.user.store) {
      return res.status(400).json({
        message: "No store linked to this merchant",
      });
    }

    const store = await Store.findById(req.user.store);

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    // Security check
    if (store.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You do not own this store",
      });
    }

    req.store = store;

    next();

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message,
    });

  }
};