import express from "express";

import protect from "../middleware/authMiddleware.js";

import admin from "../middleware/adminMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router =
  express.Router();

/* ===================================================== */
/* ================= IMAGE UPLOAD ====================== */
/* ===================================================== */

router.post(

  "/",

  protect,

  admin,

  upload.single("image"),

  (req, res) => {

    res.status(200).json({

      image:
        req.file.path,
    });
  }
);

export default router;