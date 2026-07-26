import express from "express";

import protect from "../middleware/authMiddleware.js";
import merchant from "../middleware/merchantMiddleware.js";
import { merchantStore } from "../middleware/storeMiddleware.js";
import {getMerchantProducts,} from "../controllers/productController.js";
import {
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.post(
    "/",
    protect,
    merchant,
    merchantStore,
    createProduct
);

router.put(
    "/:id",
    protect,
    merchant,
    merchantStore,
    updateProduct
);

router.delete(
    "/:id",
    protect,
    merchant,
    merchantStore,
    deleteProduct
);

router.get(
    "/test",
    protect,
    merchant,
    merchantStore,
    (req, res) => {

        res.json({
            user: req.user,
            store: req.store,
        });

    }
);

router.get(
    "/",
    protect,
    merchant,
    merchantStore,
    getMerchantProducts
);
export default router;