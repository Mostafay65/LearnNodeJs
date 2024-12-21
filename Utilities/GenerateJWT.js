var jwt = require("jsonwebtoken");

module.exports = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1m" });
};
