import express from "express";

import protect from "../middleware/authMiddleware.js";

import adminOrMerchant from "../middleware/adminOrMerchant.js";

import upload from "../middleware/uploadMiddleware.js";

const router =
  express.Router();

/* ===================================================== */
/* ================= IMAGE UPLOAD ====================== */
/* ===================================================== */

router.post(

  "/",

  protect,

  adminOrMerchant,

  upload.single("image"),

  (req, res) => {

    res.status(200).json({

      image:
        req.file.path,
    });
  }
);

export default router;