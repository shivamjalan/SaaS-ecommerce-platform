const adminOrMerchant = (req, res, next) => {

  if (!req.user) {

    return res.status(401).json({
      message: "Unauthorized",
    });

  }

  if (
    req.user.role === "admin" ||
    req.user.role === "merchant"
  ) {

    return next();

  }

  return res.status(403).json({
    message: "Admin or Merchant access only",
  });

};

export default adminOrMerchant;
