const admin = (req, res, next) => {

  if (
    req.user &&
    req.user.role === "superadmin"
  ) {

    next();

  } else {

    res.status(403).json({
      error: "Superadmin access only",
    });
  }
};

export default admin;