const adminOrMerchant = (req, res, next) => {

  if (!req.user) {

    return res.status(401).json({
      message: "Unauthorized",
    });

  }

  if (
    req.user.role === "superadmin" ||
    req.user.role === "merchant"
  ) {

    return next();

  }

  return res.status(403).json({
    message: "Superadmin or Merchant access only",
  });

};

export default adminOrMerchant;
