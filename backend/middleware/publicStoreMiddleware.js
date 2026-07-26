import Store from "../models/storeModel.js";

const publicStore = async (req, res, next) => {
  try {

    const { store } = req.query;

    if (!store) {
      return res.status(400).json({
        message: "Store slug is required",
      });
    }

    const existingStore = await Store.findOne({
      slug: store,
    });

    if (!existingStore) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    req.store = existingStore;

    next();

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

export default publicStore;