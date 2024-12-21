const jwt = require("jsonwebtoken");
const AppError = require("../Utilities/AppError");
const httpStatusText = require("../Utilities/httpStatusText");

module.exports = (...Roles) => {
    return (req, res, next) => {
        if (!req.headers.authorization) {
            return next(
                new AppError(
                    "Josn Web Token is required",
                    401,
                    httpStatusText.FAIL
                )
            );
        }
        const token = req.headers.authorization.split(" ")[1];
        try {
            const User = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.User = User;
            if (Roles.length == 0 || Roles.includes(User.role)) next();
            else throw new Error("");
        } catch (error) {
            return next(
                new AppError(
                    "You are not authorized to access this resources",
                    401,
                    httpStatusText.FAIL
                )
            );
        }
    };
};
