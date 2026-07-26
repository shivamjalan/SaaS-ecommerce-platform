const merchant = (req, res, next) => {

    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    if (req.user.role !== "merchant") {
        return res.status(403).json({
            message: "Merchant access only",
        });
    }

    next();

};

export default merchant;